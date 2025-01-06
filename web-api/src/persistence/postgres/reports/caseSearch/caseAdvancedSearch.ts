import {
  AbbreviatedStates,
  CountryTypes,
} from '@shared/business/entities/EntityConstants';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

// 10502 TODO: Make sure this is efficient! Probably want some gtin indexing.

export type CaseAdvancedSearchTerms = {
  petitionerName: string;
  countryType?: CountryTypes;
  petitionerState?: AbbreviatedStates;
  startDate?: string;
  endDate?: string;
  hideSealedCases?: boolean;
};

export type CaseAdvancedSearchResultItem = {
  caseCaption: string;
  status?: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  isSealed?: boolean;
  receivedAt: Date | null;
  sealedDate?: Date | null;
  petitioners: {
    name: string;
    state?: string;
  }[];
};

const removeAdvancedSyntaxSymbols = text => {
  const nonWordCharacters = /[-+\s[\]{}:?!*()<>=]+/gims;
  return text.replace(nonWordCharacters, ' ').trim();
};

export const caseAdvancedSearch = async ({
  searchTerms,
}: {
  searchTerms: CaseAdvancedSearchTerms;
}) => {
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
    if (searchTerms.hideSealedCases) {
      query = query.where('isSealed', 'is not', true);
      query = query.where('sealedDate', 'is', null);
    }
    // Order by our weighted match scores
    return query.selectAll().orderBy('total_rank', 'desc').execute();
  });

  return Array.from(newQuery.values()).map<CaseAdvancedSearchResultItem>(
    data => {
      return {
        caseCaption: data.caption,
        docketNumber: data.docketNumber,
        docketNumberWithSuffix:
          data.docketNumber + (data.docketNumberSuffix || ''),
        isSealed: data.isSealed || undefined,
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
