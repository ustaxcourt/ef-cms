import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';
import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';

export const removeAdvancedSyntaxSymbols = text => {
  const nonWordCharacters = /[-+\s[\]{}:?!*()<>=]+/gims;
  return text.replace(nonWordCharacters, ' ').trim();
};

export const aggregateCommonQueryParams = ({
  countryType,
  endDate,
  petitionerName,
  petitionerState,
  startDate,
  caseTypes,
  procedureType,
}: CaseAdvancedSearchParamsRequestType) => {
  const commonQuery: QueryContainer[] = [];
  const exactMatchesQuery: QueryContainer[] = [];
  const nonExactMatchesQuery: QueryContainer[] = [];

  if (petitionerName) {
    const simplePetitionerQuery = removeAdvancedSyntaxSymbols(petitionerName);

    exactMatchesQuery.push({
      bool: {
        should: [
          {
            simple_query_string: {
              default_operator: 'and',
              fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
              flags: 'AND|PHRASE|PREFIX',
              boost: 20,
              query: `"${simplePetitionerQuery}"`, // match complete phrase
            },
          },
          {
            simple_query_string: {
              default_operator: 'and',
              fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
              flags: 'AND|PHRASE|PREFIX',
              boost: 0.5,
              query: simplePetitionerQuery, // match all terms in any order
            },
          },
        ],
      },
    });
    nonExactMatchesQuery.push({
      simple_query_string: {
        default_operator: 'or', // any subset of all terms
        fields: ['petitioners.L.M.name.S^5', 'caseCaption.S'],
        query: simplePetitionerQuery,
      },
    });
  }

  if (countryType) {
    commonQuery.push({
      bool: {
        should: [{ match: { 'petitioners.L.M.countryType.S': countryType } }],
      },
    });
  }

  if (petitionerState) {
    commonQuery.push({
      bool: {
        should: [{ match: { 'petitioners.L.M.state.S': petitionerState } }],
      },
    });
  }

  if (endDate && startDate) {
    commonQuery.push({
      range: {
        'receivedAt.S': {
          format: 'strict_date_optional_time',
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  commonQuery.push({ match: { 'entityName.S': 'Case' } });

  if (caseTypes) {
    commonQuery.push({ terms: { 'caseType.S': caseTypes } });
  }

  if (procedureType) {
    commonQuery.push({ match: { 'procedureType.S': procedureType } });
  }

  return { commonQuery, exactMatchesQuery, nonExactMatchesQuery };
};
