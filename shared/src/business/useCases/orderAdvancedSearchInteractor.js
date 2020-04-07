const AWS = require('aws-sdk');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { get } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.orderAdvancedSearchInteractor = async ({
  applicationContext,
  orderKeyword,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  console.log('............', orderKeyword);

  const blockedSearchBody = {
    _source: [
      'docketNumber',
      'documentContents',
      'docketNumberSuffix',
      'documentTitle',
      'pk',
      'sk',
    ],
    query: {
      bool: {
        must: [
          //add pk case| and sk document| and check for type order
          {
            exists: {
              field: 'servedAt',
            },
          },
          {
            exists: {
              field: 'documentTitle',
            },
          },
          //FIXME ask Amy or someone if all documents must have a docket number to be searched - maybe can do a should for title and docket no
          {
            exists: {
              field: 'docketNumber',
            },
          },
          {
            simple_query_string: {
              default_operator: 'or',
              // only include fields that are required by UX
              fields: ['*'],
              query: orderKeyword,
            },
          },
        ],
      },
    },
    size: 5000,
  };

  // search served documents that are orders for keyword phrase
  const exactMatchesBody = await applicationContext.getSearchClient().search({
    body: blockedSearchBody,
    index: 'efcms',
  });

  const hits = get(exactMatchesBody, 'hits.hits', []);
  const foundOrders = hits.map(hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']),
  );

  console.log('things we got back : ', foundOrders);

  return [];

  // const {
  //   commonQuery,
  //   exactMatchesQuery,
  //   nonExactMatchesQuery,
  // } = aggregateCommonQueryParams(providers);

  // const exactMatchesBody = await applicationContext.getSearchClient().search({
  //   body: {
  //     _source: [
  //       'caseCaption',
  //       'contactPrimary',
  //       'contactSecondary',
  //       'docketNumber',
  //       'docketNumberSuffix',
  //       'irsPractitioners',
  //       'privatePractitioners',
  //       'receivedAt',
  //       'sealedDate',
  //     ],
  //     query: {
  //       bool: {
  //         must: [...exactMatchesQuery, ...commonQuery],
  //       },
  //     },
  //     size: 5000,
  //   },
  //   index: 'efcms',
  // });

  // let foundCases = [];
  // const exactMatchesHits = get(exactMatchesBody, 'hits.hits');
  // const unmarshallHit = hit =>
  //   AWS.DynamoDB.Converter.unmarshall(hit['_source']);

  // if (!isEmpty(exactMatchesHits)) {
  //   foundCases = exactMatchesHits.map(unmarshallHit);
  // } else {
  //   const nonExactMatchesBody = await applicationContext
  //     .getSearchClient()
  //     .search({
  //       body: {
  //         _source: [
  //           'caseCaption',
  //           'contactPrimary',
  //           'contactSecondary',
  //           'docketNumber',
  //           'docketNumberSuffix',
  //           'receivedAt',
  //           'sealedDate',
  //         ],
  //         query: {
  //           bool: {
  //             must: [...nonExactMatchesQuery, ...commonQuery],
  //           },
  //         },
  //       },
  //       index: 'efcms',
  //     });

  //   const nonExactMatchesHits = get(nonExactMatchesBody, 'hits.hits');

  //   if (!isEmpty(nonExactMatchesHits)) {
  //     foundCases = nonExactMatchesHits.map(unmarshallHit);
  //   }
  // }

  // foundCases = caseSearchFilter(foundCases, authorizedUser);

  // return foundCases;
};
