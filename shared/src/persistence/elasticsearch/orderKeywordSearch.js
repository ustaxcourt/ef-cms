const { search } = require('./searchClient');

exports.orderKeywordSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  orderEventCodes,
  orderKeyword,
  startDate,
}) => {
  const sourceFields = [
    'caseCaption',
    'caseId',
    'contactPrimary',
    'contactSecondary',
    'docketNumber',
    'docketNumberSuffix',
    'documentContents',
    'documentId',
    'documentTitle',
    'filingDate',
    'irsPractitioners',
    'isSealed',
    'privatePractitioners',
    'sealedDate',
    'signedJudgeName',
  ];

  const queryParams = [
    {
      bool: {
        should: orderEventCodes.map(eventCode => ({
          match: {
            'eventCode.S': eventCode,
          },
        })),
      },
    },
  ];

  if (caseTitleOrPetitioner) {
    queryParams.push({
      simple_query_string: {
        fields: [
          'caseCaption.S',
          'contactPrimary.M.name.S',
          'contactSecondary.M.name.S',
        ],
        query: caseTitleOrPetitioner,
      },
    });
  }

  if (orderKeyword) {
    queryParams.push({
      simple_query_string: {
        fields: ['documentContents.S', 'documentTitle.S'],
        query: orderKeyword,
      },
    });
  }

  if (judge) {
    queryParams.push({
      bool: {
        must: {
          match: {
            'signedJudgeName.S': judge,
          },
        },
      },
    });
  }

  if (docketNumber) {
    queryParams.push({
      match: {
        'docketNumber.S': {
          operator: 'and',
          query: docketNumber,
        },
      },
    });
  }

  if (startDate && endDate) {
    queryParams.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  const orderQuery = {
    body: {
      _source: sourceFields,
      query: {
        bool: {
          must: [
            { match: { 'pk.S': 'case|' } },
            { match: { 'sk.S': 'document|' } },
            {
              exists: {
                field: 'servedAt',
              },
            },
            ...queryParams,
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-document',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: orderQuery,
  });

  return results;
};
