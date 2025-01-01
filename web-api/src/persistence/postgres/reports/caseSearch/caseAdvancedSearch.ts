import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { removeAdvancedSyntaxSymbols } from '@shared/business/utilities/aggregateCommonQueryParams';
import { sql } from 'kysely';

// 10502 TODO: Make sure this is efficient! Probably want some gtin indexing.

type CaseAdvancedSearchTerms = {
  petitionerName: string;
  petitionerState?: string;
  countryType?: string;
  startDate?: string;
  endDate?: string;
};

type CaseAdvancedSearchResultItem = {
  caseCaption: string;
  status?: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  isSealed?: boolean;
  receivedAt: Date | null;
  sealedDate?: Date | null;
  partyType: string;
  petitioners: {
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

  const sanitizeSearchString = (searchString: string) => {
    return removeAdvancedSyntaxSymbols(searchString);
  };

  const sanitizedSearchString = sanitizeSearchString(
    searchTerms.petitionerName,
  );

  const newQuery = await getDbReader(reader => {
    let query = reader
      // Get all cases, aggregating petitioner names and case caption data
      .with('cases', db =>
        db
          .selectFrom('dwCase as case')
          .leftJoin(
            'dwPetitionerOnCase as petitioner',
            'case.docketNumber',
            'petitioner.docketNumber',
          )
          .select([
            'case.docketNumber',
            'case.receivedAt',
            'case.docketNumberSuffix',
            'case.isSealed',
            'case.caption',
            'case.isSealed',
            'case.partyType',
            'case.sealedDate',
            'case.status',
            sql<string>`string_agg("petitioner".name, ', ') || ' '`.as(
              'nameToMatch',
            ),
            sql<string[]>`array_agg("petitioner".state)`.as('petitionerStates'),
            sql<string[]>`array_agg("petitioner".country_type)`.as(
              'petitionerCountryTypes',
            ),
          ])
          .groupBy(['case.docketNumber']),
      )
      // Weight matches of our search string with petitioner names (high weight) and case captions (low weight)
      .with('cases_with_scores', db =>
        db
          .selectFrom('cases')
          .selectAll()
          .select(
            sql`5 * word_similarity(${sanitizedSearchString}, name_to_match) + word_similarity(${sanitizedSearchString}, caption)`.as(
              'total_rank',
            ),
          ),
      )
      .selectFrom('cases_with_scores')
      .where('total_rank', '>', 3); // Filter out unmatched data
    // Do additional filtering as needed
    if (searchTerms.countryType) {
      query = query.where(eb =>
        eb.and([
          sql<boolean>`${searchTerms.countryType} = ANY(${eb.ref('petitionerCountryTypes')})`,
        ]),
      );
    }
    if (searchTerms.petitionerState) {
      query = query.where(eb =>
        eb.and([
          sql<boolean>`${searchTerms.petitionerState} = ANY(${eb.ref('petitionerStates')})`,
        ]),
      );
    }
    if (searchTerms.startDate) {
      query = query.where(
        'receivedAt',
        '>=',
        calculateDate({ dateString: searchTerms.startDate }),
      );
    }
    if (searchTerms.endDate) {
      query = query.where(
        'receivedAt',
        '<=',
        calculateDate({ dateString: searchTerms.endDate }),
      );
    }
    // Order by our weighted match scores
    return query.selectAll().orderBy('total_rank', 'desc').execute();
  });

  console.log(newQuery);

  return Array.from(newQuery.values()).map<CaseAdvancedSearchResultItem>(
    data => {
      return {
        caseCaption: data.caption,
        docketNumber: data.docketNumber,
        docketNumberWithSuffix:
          data.docketNumber + (data.docketNumberSuffix || ''),
        isSealed: data.isSealed || undefined,
        partyType: data.partyType,
        petitioners: data.nameToMatch.split(',').map((name, index) => ({
          name: name.trim(),
          state: data.petitionerStates?.[index],
        })),
        receivedAt: data.receivedAt,
        sealedDate: data.sealedDate,
        status: data.status,
      };
    },
  );
};
