const AWS = require('aws-sdk');
const { Case } = require('../../entities/cases/Case');
const { get, pick } = require('lodash');

/**
 * fetchPendingItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.caseId the optional caseId filter
 * @returns {Array} the pending items found
 */
exports.fetchPendingItems = async ({ applicationContext, caseId, judge }) => {
  const source = [
    'associatedJudge',
    'documents',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'status',
  ];

  const foundCases = [];

  if (caseId) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
    const caseEntity = new Case(caseResult, { applicationContext });
    foundCases.push(pick(caseEntity.validate().toRawObject(), source));
  } else {
    const searchParameters = {
      body: {
        _source: source,
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
        match_phrase: { 'associatedJudge.S': judge },
      });
    }

    const body = await applicationContext
      .getSearchClient()
      .search(searchParameters);

    const hits = get(body, 'hits.hits');

    if (hits && hits.length > 0) {
      hits.forEach(hit => {
        foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
      });
    }
  }

  const foundDocuments = [];

  foundCases.forEach(foundCase => {
    const { documents, ...mappedProps } = foundCase;
    mappedProps.caseStatus = mappedProps.status;

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
