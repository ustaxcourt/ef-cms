const { CASE_SEARCH_MIN_YEAR } = require('../entities/EntityConstants');

const removeAdvancedSyntaxSymbols = text => {
  const nonWordCharacters = /[-+\s[\]{}:?!*."()<>=]+/gims;
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
    const simplePetitionerQuery = removeAdvancedSyntaxSymbols(petitionerName);
    const simpleQuery = {
      default_operator: 'and',
      fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
      flags: 'AND|PHRASE|PREFIX',
    };

    exactMatchesQuery.push({
      bool: {
        should: [
          {
            simple_query_string: {
              ...simpleQuery,
              boost: 20,
              query: `"${simplePetitionerQuery}"`, // match complete phrase
            },
          },
          {
            simple_query_string: {
              ...simpleQuery,
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
        should: [
          {
            match: {
              'petitioners.L.M.countryType.S': countryType,
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
              'petitioners.L.M.state.S': petitionerState,
            },
          },
        ],
      },
    });
  }

  if (yearFiledMin || yearFiledMax) {
    const yearMin = yearFiledMin ? yearFiledMin.trim() : CASE_SEARCH_MIN_YEAR;
    const yearMax = yearFiledMax
      ? yearFiledMax.trim()
      : applicationContext.getUtilities().formatNow('YYYY');

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
  removeAdvancedSyntaxSymbols,
};
