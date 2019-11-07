const AWS = require('aws-sdk');
const { get } = require('lodash');

/**
 * fetchPendingItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @returns {object} the case data
 */
exports.fetchPendingItems = async ({ applicationContext, judge }) => {
  const searchParameters = {
    body: {
      _source: [
        'associatedJudge',
        'documents',
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'status',
      ],
      query: {
        bool: {
          must: [{ match: { 'hasPendingItems.BOOL': true } }],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  };

  if (judge) {
    searchParameters.body.query.bool.must.push({
      match: { 'associatedJudge.S': judge },
    });
  }

  const body = await applicationContext
    .getSearchClient()
    .search(searchParameters);

  const foundCases = [];
  const hits = get(body, 'hits.hits');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  const foundDocuments = [];

  foundCases.forEach(foundCase => {
    const { documents, ...mappedProps } = foundCase;

    documents.forEach(document => {
      if (document.pending) {
        foundDocuments.push({
          ...mappedProps,
          ...document,
        });
      }
    });
  });

  return foundDocuments;
};
