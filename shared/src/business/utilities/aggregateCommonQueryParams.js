const { CASE_SEARCH_MIN_YEAR } = require('../entities/EntityConstants');

const makeSimpleQuerySafe = text => {
  const nonWordCharacters = /\W+/gims;
  return text.replace(nonWordCharacters, ' ').trim();
};

/**
 * aggregateCommonQueryParams
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.countryType the country type to search cases by (domestic/international)
 * @param {string} providers.petitionerName the name of the petitioner to search cases by
 * @param {string} providers.petitionerState the state of the petitioner to search cases by
 * @param {string} providers.yearFiledMax the max year filed to search cases by
 * @param {string} providers.yearFiledMin the min year filed to search cases by
 * @returns {object} the case data
 */
const aggregateCommonQueryParams = ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
  const commonQuery = [];
  const exactMatchesQuery = [];
  const nonExactMatchesQuery = [];

  if (petitionerName) {
    const simplePetitionerQuery = makeSimpleQuerySafe(petitionerName);
    exactMatchesQuery.push({
      bool: {
        should: [
          {
            simple_query_string: {
              boost: 2,
              default_operator: 'and',
              fields: [
                'contactPrimary.M.name.S^3',
                'contactPrimary.M.secondaryName.S^2',
                'contactSecondary.M.name.S^1',
                'caseCaption.S',
              ],
              flags: 'AND|PHRASE|PREFIX',
              query: `"${simplePetitionerQuery}"`, // match complete phrase
            },
          },
          {
            simple_query_string: {
              boost: 1,
              default_operator: 'and',
              fields: [
                'contactPrimary.M.name.S^3',
                'contactPrimary.M.secondaryName.S^2',
                'contactSecondary.M.name.S^1',
                'caseCaption.S',
              ],
              flags: 'AND|PHRASE|PREFIX',
              query: simplePetitionerQuery, // match all terms in any order
            },
          },
        ],
      },
    });
    nonExactMatchesQuery.push({
      simple_query_string: {
        default_operator: 'or', // any subset of all terms
        fields: [
          'contactPrimary.M.name.S^3',
          'contactPrimary.M.secondaryName.S^2',
          'contactSecondary.M.name.S^1',
          'caseCaption.S^0',
        ],
        query: simplePetitionerQuery,
      },
    });
  }

  if (countryType) {
    commonQuery.push({
      bool: {
        should: [
          {
            match: {
              'contactPrimary.M.countryType.S': countryType,
            },
          },
          {
            match: {
              'contactSecondary.M.countryType.S': countryType,
            },
          },
        ],
      },
    });
  }
  if (petitionerState) {
    commonQuery.push({
      bool: {
        should: [
          {
            match: {
              'contactPrimary.M.state.S': petitionerState,
            },
          },
          {
            match: {
              'contactSecondary.M.state.S': petitionerState,
            },
          },
        ],
      },
    });
  }
  if (yearFiledMin || yearFiledMax) {
    const yearMin = yearFiledMin || CASE_SEARCH_MIN_YEAR;
    const yearMax =
      yearFiledMax || applicationContext.getUtilities().formatNow('YYYY');

    commonQuery.push({
      range: {
        'receivedAt.S': {
          format: 'yyyy',
          gte: `${yearMin}||/y`,
          lte: `${yearMax}||/y`,
        },
      },
    });
  }

  commonQuery.push({ match: { 'entityName.S': 'Case' } });

  return {
    commonQuery,
    exactMatchesQuery,
    nonExactMatchesQuery,
  };
};

module.exports = {
  aggregateCommonQueryParams,
};
