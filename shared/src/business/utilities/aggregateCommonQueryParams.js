const { CaseSearch } = require('../entities/cases/CaseSearch');

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
    const petitionerNameArray = petitionerName.toLowerCase().split(' ');
    exactMatchesQuery.push({
      bool: {
        should: [
          {
            bool: {
              minimum_should_match: petitionerNameArray.length,
              should: petitionerNameArray.map(word => {
                return {
                  term: {
                    'contactPrimary.M.name.S': word,
                  },
                };
              }),
            },
          },
          {
            bool: {
              minimum_should_match: petitionerNameArray.length,
              should: petitionerNameArray.map(word => {
                return {
                  term: {
                    'contactPrimary.M.secondaryName.S': word,
                  },
                };
              }),
            },
          },
          {
            bool: {
              minimum_should_match: petitionerNameArray.length,
              should: petitionerNameArray.map(word => {
                return {
                  term: {
                    'contactSecondary.M.name.S': word,
                  },
                };
              }),
            },
          },
        ],
      },
    });

    nonExactMatchesQuery.push({
      bool: {
        should: [
          { match: { 'contactPrimary.M.name.S': petitionerName } },
          { match: { 'contactPrimary.M.secondaryName.S': petitionerName } },
          { match: { 'contactSecondary.M.name.S': petitionerName } },
        ],
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
    const yearMin = yearFiledMin || CaseSearch.CASE_SEARCH_MIN_YEAR;
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

  return {
    commonQuery,
    exactMatchesQuery,
    nonExactMatchesQuery,
  };
};

module.exports = {
  aggregateCommonQueryParams,
};
