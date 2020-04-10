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
  const sourceFields = [
    'docketNumber',
    'documentContents',
    'docketNumberSuffix',
    'documentTitle',
    'signedJudgeName',
    'filingDate',
    'caseId',
    'documentId',
  ];

  const orderEventCodeQuery = {
    bool: {
      should: orderEventCodes.map(eventCode => ({
        match: {
          'eventCode.S': eventCode,
        },
      })),
    },
  };
  //probably move to utilities

  const sortByDocketNumber = (a, b) => {
    const [aNumber, aYear] = a['docketNumber'].split('-');
    const [bNumber, bYear] = b['docketNumber'].split('-');
    if (aYear < bYear) {
      if (aNumber > bNumber) {
        return 1;
      } else if (aNumber < bNumber) {
        return -1;
      } else {
        return 0;
      }
    } else if (bYear < aYear) {
      if (bNumber > aNumber) {
        return 1;
      } else if (bNumber < aNumber) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  const exactOrderSearchBody = {
    _source: sourceFields,
    query: {
      bool: {
        must: [
          { match: { 'pk.S': 'case|' } },
          { match: { 'sk.S': 'document|' } },
          orderEventCodeQuery,
          {
            exists: {
              field: 'servedAt',
            },
          },
          {
            query_string: {
              default_operator: 'or',
              fields: ['documentContents.S', 'documentTitle.S'],
              query: orderKeyword,
            },
          },
        ],
      },
    },
    // sort: {},
    size: 5000,
  };

  const partialOrderSearchBody = {
    _source: sourceFields,
    query: {
      bool: {
        must: [
          { match: { 'pk.S': 'case|' } },
          { match: { 'sk.S': 'document|' } },
          orderEventCodeQuery,
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
    body: exactOrderSearchBody,
    index: 'efcms',
  });

  const partialMatchesBody = await applicationContext.getSearchClient().search({
    body: partialOrderSearchBody,
    index: 'efcms',
  });

  const exactHits = get(exactMatchesBody, 'hits.hits', []);
  const partialHits = get(partialMatchesBody, 'hits.hits', []);

  const exactMatches = exactHits.map(hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']),
  );
  const partialMatches = partialHits.map(hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']),
  );

  const exactMatchesSortedByDocketNumber = exactMatches
    .map(order => order)
    .sort(sortByDocketNumber);

  const partialMatchesSortedByDocketNumber = partialMatches
    .map(order => order)
    .sort(sortByDocketNumber);

  //check if exact matches has any of the results from partial matches, if so, remove that object from partial
  partialMatchesSortedByDocketNumber.map(order => {
    if (exactMatchesSortedByDocketNumber.find(order2 => order === order2)) {
      delete partialMatchesSortedByDocketNumber[order];
    }
  });

  const foundOrders = [
    ...exactMatchesSortedByDocketNumber,
    ...partialMatchesSortedByDocketNumber,
  ];

  for (const order of foundOrders) {
    const { caseId } = order;

    const matchingCase = await applicationContext
      .getUseCases()
      .getCaseInteractor({ applicationContext, caseId });

    order.docketNumberSuffix = matchingCase.docketNumberSuffix;
    order.caseCaption = matchingCase.caseCaption;
  }

  console.log(JSON.stringify(foundOrders, null, 4));

  return foundOrders;
};
