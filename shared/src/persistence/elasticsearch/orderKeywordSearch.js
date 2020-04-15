const { search } = require('./searchClient');

exports.orderKeywordSearch = async ({
  applicationContext,
  orderEventCodes,
  orderKeyword,
}) => {
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

  const orderQuery = {
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

  const { results } = await search({
    applicationContext,
    searchParameters: orderQuery,
  });

  return results;
};
