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
}) => {
  const query = [];

  if (petitionerName) {
    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.M.name.S': petitionerName } },
          { match: { 'contactSecondary.M.name.S': petitionerName } },
        ],
      },
    });
  }
  if (countryType) {
    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.M.countryType.S': countryType } },
          { match: { 'contactSecondary.M.countryType.S': countryType } },
        ],
      },
    });
  }
  if (petitionerState) {
    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.M.state.S': petitionerState } },
          { match: { 'contactSecondary.M.state.S': petitionerState } },
        ],
      },
    });
  }
  //TODO store the yearFiled on the case entity so we can search by it
  /*if (yearFiledMin || yearFiledMax) {
    query.push({
      range: {
        yearFiled: {
          boost: 2.0,
          gte: yearFiledMin,
          lte: yearFiledMax,
        },
      },
    });
  }*/

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

  const foundCases = [];
  if (body && body.hits) {
    for (let hit of body.hits.hits) {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    }
  }

  return foundCases;
};
