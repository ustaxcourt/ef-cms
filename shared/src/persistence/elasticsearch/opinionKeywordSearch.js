const { search } = require('./searchClient');

exports.opinionKeywordSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  keyword,
  opinionEventCodes,
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
    'numberOfPages',
    'documentId',
    'documentTitle',
    'documentType',
    'filingDate',
    'irsPractitioners',
    'isSealed',
    'privatePractitioners',
    'sealedDate',
    'judge',
  ];

  const queryParams = [
    {
      bool: {
        should: opinionEventCodes.map(eventCode => ({
          match: {
            'eventCode.S': eventCode,
          },
        })),
      },
    },
  ];

  if (keyword) {
    queryParams.push({
      simple_query_string: {
        fields: ['documentContents.S', 'documentTitle.S'],
        query: keyword,
      },
    });
  }

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

  const opinionQuery = {
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
    searchParameters: opinionQuery,
  });

  return results;
};
