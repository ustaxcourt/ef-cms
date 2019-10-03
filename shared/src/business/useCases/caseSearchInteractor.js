const AWS = require('aws-sdk');

/**
 * caseSearchInteractor
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
exports.caseSearchInteractor = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
  const query = [];

  if (petitionerName) {
    const petitionerNameArray = petitionerName.split(' ');

    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.M.name.S': petitionerName } },
          { match: { 'contactPrimary.M.secondaryName.S': petitionerName } },
          { match: { 'contactSecondary.M.name.S': petitionerName } },
        ],
      },
    });
    query.push({
      bool: {
        should: [
          {
            terms: {
              boost: 5,
              'contactPrimary.M.name.S': petitionerNameArray,
            },
          },
          {
            terms: {
              boost: 5,
              'contactPrimary.M.secondaryName.S': petitionerNameArray,
            },
          },
          {
            terms: {
              boost: 5,
              'contactSecondary.M.name.S': petitionerNameArray,
            },
          },
        ],
      },
    });
  }
  if (countryType) {
    query.push({
      bool: {
        should: [
          {
            match: {
              'contactPrimary.M.countryType.S': {
                // boost: 2,
                query: countryType,
              },
            },
          },
          {
            match: {
              'contactSecondary.M.countryType.S': {
                // boost: 2,
                query: countryType,
              },
            },
          },
        ],
      },
    });
  }
  if (petitionerState) {
    query.push({
      bool: {
        should: [
          {
            match: {
              'contactPrimary.M.state.S': {
                // boost: 2,
                query: petitionerState,
              },
            },
          },
          {
            match: {
              'contactSecondary.M.state.S': {
                // boost: 2,
                query: petitionerState,
              },
            },
          },
        ],
      },
    });
  }
  if (yearFiledMin || yearFiledMax) {
    query.push({
      bool: {
        should: [
          {
            range: {
              'createdAt.S': {
                format: 'yyyy',
                gte: `${yearFiledMin}||/y`,
                lte: `${yearFiledMax}||/y`,
              },
            },
          },
          {
            range: {
              'receivedAt.S': {
                format: 'yyyy',
                gte: `${yearFiledMin}||/y`,
                lte: `${yearFiledMax}||/y`,
              },
            },
          },
        ],
      },
    });
  }

  const body = await applicationContext.getSearchClient().search({
    body: {
      query: {
        bool: {
          must: query,
        },
      },
    },
    index: 'efcms',
  });

  let foundCases = [];
  console.log(JSON.stringify(body));
  if (body && body.hits) {
    const { hits, max_score } = body.hits;

    if (max_score > 5) {
      for (let hit of hits) {
        const thisScore = hit['_score'];
        if (thisScore > 5) {
          foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
        }
      }
    } else {
      for (let hit of hits) {
        foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
      }
    }
  }

  return foundCases;
};
