const { search } = require('./searchClient');

exports.opinionKeywordSearch = async ({
  applicationContext,
  keyword,
  opinionEventCodes,
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
