const AWS = require('aws-sdk');
const { get } = require('lodash');

/**
 * getCaseInventoryReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the optional judge filter
 * @param {string} providers.status the optional status filter
 * @returns {Array} the pending items found
 */
exports.getCaseInventoryReport = async ({
  applicationContext,
  associatedJudge,
  status,
}) => {
  const source = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'status',
  ];

  const foundCases = [];

  const searchParameters = {
    body: {
      _source: source,
      query: {
        bool: {
          must: [],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  };

  if (associatedJudge) {
    searchParameters.body.query.bool.must.push({
      match_phrase: { 'associatedJudge.S': associatedJudge },
    });
  }
  if (status) {
    searchParameters.body.query.bool.must.push({
      match_phrase: { 'status.S': status },
    });
  }

  const body = await applicationContext
    .getSearchClient()
    .search(searchParameters);

  const hits = get(body, 'hits.hits');
  const totalCount = get(body, 'hits.total.value');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  return {
    foundCases,
    totalCount,
  };
};
