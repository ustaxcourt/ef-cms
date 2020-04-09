const AWS = require('aws-sdk');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { get, map } = require('lodash');
const { Order } = require('../entities/orders/Order');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, orderKeyword
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.orderKeyword the search term to look for in documents
 * @returns {object} the orders data
 */
exports.orderAdvancedSearchInteractor = async ({
  applicationContext,
  orderKeyword,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderEventCodes = map(Order.ORDER_TYPES, 'eventCode');

  const orderSearchBody = {
    _source: [
      'docketNumber',
      'documentContents',
      'docketNumberSuffix',
      'documentTitle',
      'signedJudgeName',
      'filingDate',
      'caseId',
      'documentId',
    ],
    query: {
      bool: {
        must: [
          { match: { 'pk.S': 'case|' } },
          { match: { 'sk.S': 'document|' } },
          {
            bool: {
              should: orderEventCodes.map(eventCode => ({
                match: {
                  'eventCode.S': eventCode,
                },
              })),
            },
          },
          {
            exists: {
              field: 'servedAt',
            },
          },
          {
            query_string: {
              default_operator: 'or',
              fields: ['documentContents.S', 'documentTitle.S'],
              query: `*${orderKeyword}*`,
            },
          },
        ],
      },
    },
    size: 5000,
  };

  const exactMatchesBody = await applicationContext.getSearchClient().search({
    body: orderSearchBody,
    index: 'efcms',
  });

  const hits = get(exactMatchesBody, 'hits.hits', []);
  const foundOrders = hits.map(hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']),
  );

  for (const order of foundOrders) {
    const { caseId } = order;

    const matchingCase = await applicationContext
      .getUseCases()
      .getCaseInteractor({ applicationContext, caseId });

    order.docketNumberSuffix = matchingCase.docketNumberSuffix;
    order.caseCaption = matchingCase.caseCaption;
  }

  return foundOrders;
};
