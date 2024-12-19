import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

type CaseAdvancedSearchTerms = {
  petitionerName?: string;
  petitionerState?: string;
  countryType?: string;
  startDate?: string;
  endDate?: string;
};

// 10502 TODO: Fix types here, maybe by appealing to the Kysely mappers
type CaseAdvancedSearchResultItem = {
  caseCaption: string;
  status?: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  isSealed?: boolean;
  receivedAt: string;
  sealedDate?: string;
  petitioners: {
    contactId: string;
    countryType: string;
    name: string;
    state?: string;
  }[];
};

export const caseAdvancedSearch = async ({
  searchTerms,
}: {
  searchTerms: CaseAdvancedSearchTerms;
}) => {
  console.log('searchTerms', searchTerms);

  const needPetitionerInformation = [
    searchTerms.petitionerName,
    searchTerms.petitionerState,
    searchTerms.countryType,
  ].some(Boolean);

  const getDocketNumbersForPetitionerInfo = async () => {
    const results = await getDbReader(reader => {
      let query = reader
        .selectFrom('dwCase as c')
        .innerJoin(
          'dwPetitionerOnCase as p',
          'c.docketNumber',
          'p.docketNumber',
        )
        .select(['c.docketNumber']);
      if (searchTerms.countryType) {
        query = query.where('p.countryType', '=', searchTerms.countryType);
      }
      if (searchTerms.petitionerState) {
        query = query.where('p.state', '=', searchTerms.petitionerState);
      }
      if (searchTerms.petitionerName) {
        // We will do a postgres full-text search on petitioner name, based on tokens
        // Split the string into tokens, and do an OR match (i.e., find any of these strings)
        const petitionerNameSearchString = searchTerms.petitionerName
          .split(' ')
          .join(' | ');
        query = query
          .where(
            // @ts-ignore: 10502 TODO: Can this be typed effectively?
            sql`to_tsvector('english', p.name) @@ to_tsquery('english', ${petitionerNameSearchString})`,
          )
          .orderBy(
            sql`ts_rank_cd(
            setweight(to_tsvector('english', p.name), 'A'),
            to_tsquery('english', ${petitionerNameSearchString})
          ) +
          ts_rank_cd(
            setweight(to_tsvector('english', c.caption), 'C'),
            to_tsquery('english', ${petitionerNameSearchString})
          )`,
            'desc',
          );
      }

      return query.execute();
    });

    // De-duplicate and maintain order
    const filteredResults: string[] = [results[0].docketNumber];
    for (let i = 1; i < results.length; i++) {
      if (results[i].docketNumber !== results[i - 1].docketNumber) {
        filteredResults.push(results[i].docketNumber);
      }
    }
    return filteredResults;
  };

  const results = await getDbReader(async reader => {
    let petitionerDocketNumbers: string[] = [];

    // If we need petitioner data, we filter docket numbers by that data
    if (needPetitionerInformation) {
      petitionerDocketNumbers = await getDocketNumbersForPetitionerInfo();
      if (!petitionerDocketNumbers) {
        return [];
      }
    }
    let casesQuery = reader
      .selectFrom('dwCase as case')
      .leftJoin(
        'dwPetitionerOnCase as petitioner',
        'case.docketNumber',
        'petitioner.docketNumber',
      )
      .selectAll()
      .select('case.docketNumber');
    if (petitionerDocketNumbers) {
      casesQuery = casesQuery.where(
        'case.docketNumber',
        'in',
        petitionerDocketNumbers,
      );
    }
    if (searchTerms.startDate && searchTerms.endDate) {
      casesQuery = casesQuery
        .where(
          'case.receivedAt',
          '>=',
          calculateDate({ dateString: searchTerms.startDate }),
        )
        .where(
          'case.receivedAt',
          '<=',
          calculateDate({ dateString: searchTerms.endDate }),
        );
    }
    const cases = await casesQuery
      .select([
        'case.caption',
        'case.docketNumber',
        'case.docketNumberSuffix',
        'case.isSealed',
        'case.receivedAt',
        'case.sealedDate',
        'case.status',
        'petitioner.contactId',
        'petitioner.countryType',
        'petitioner.name',
        'petitioner.state',
      ])
      .execute();

    if (petitionerDocketNumbers) {
      const docketNumberToRank = new Map(
        petitionerDocketNumbers.map((item, index) => [item, index]),
      );

      // Sort by the rank
      cases.sort(
        (a, b) =>
          (docketNumberToRank.get(a.docketNumber) || Infinity) -
          (docketNumberToRank.get(b.docketNumber) || Infinity),
      );
    }
    return cases;
  });

  const caseMap = new Map<string, CaseAdvancedSearchResultItem>();
  for (const result of results) {
    if (caseMap.has(result.docketNumber)) {
      if (result.contactId) {
        caseMap.get(result.docketNumber)!.petitioners.push({
          contactId: result.contactId,
          country: result.countryType,
          name: result.name,
          state: result.state,
        });
      }
    } else {
      caseMap.set(result.docketNumber, {
        caseCaption: result.caption,
        docketNumber: result.docketNumber,
        docketNumberWithSuffix: result.docketNumber + result.docketNumberSuffix,
        isSealed: result.isSealed || undefined,
        petitioners: result.contactId
          ? [
              {
                contactId: result.contactId,
                country: result.countryType,
                name: result.name,
                state: result.state,
              },
            ]
          : [],
        receivedAt: result.receivedAt,
        sealedDate: result.sealedDate,
        status: result.status,
      });
    }
  }

  return Array.from(caseMap.values());
};
