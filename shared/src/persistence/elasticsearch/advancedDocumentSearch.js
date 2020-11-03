const {
  MAX_SEARCH_RESULTS,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

exports.advancedDocumentSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  documentEventCodes,
  endDate,
  judge,
  judgeType,
  keyword,
  opinionType,
  startDate,
}) => {
  const sourceFields = [
    'caseCaption',
    'contactPrimary',
    'contactSecondary',
    'docketEntryId',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'documentContents',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'irsPractitioners',
    'isSealed',
    'numberOfPages',
    'privatePractitioners',
    'sealedDate',
    judgeType,
  ];

  const queryParams = [
    {
      bool: {
        should: documentEventCodes.map(eventCode => ({
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

  const parentQueryParams = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: sourceFields,
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };

  if (docketNumber) {
    parentQueryParams.has_parent.query = {
      match: {
        'docketNumber.S': { operator: 'and', query: docketNumber },
      },
    };
  } else if (caseTitleOrPetitioner) {
    parentQueryParams.has_parent.query = {
      simple_query_string: {
        fields: [
          'caseCaption.S',
          'contactPrimary.M.name.S',
          'contactSecondary.M.name.S',
        ],
        query: caseTitleOrPetitioner,
      },
    };
  }

  queryParams.push(parentQueryParams);

  if (judge) {
    const judgeName = judge.replace(/Chief\s|Legacy\s|Judge\s/g, '');
    const judgeField = `${judgeType}.S`;
    queryParams.push({
      bool: {
        should: {
          match: {
            [judgeField]: {
              operator: 'and',
              query: judgeName,
            },
          },
        },
      },
    });
  }

  if (opinionType) {
    queryParams.push({
      match: {
        'documentType.S': {
          operator: 'and',
          query: opinionType,
        },
      },
    });
  }

  if (startDate) {
    queryParams.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
        },
      },
    });
  }

  if (endDate && startDate) {
    queryParams.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          lte: endDate,
        },
      },
    });
  }

  const documentQuery = {
    body: {
      _source: sourceFields,
      query: {
        bool: {
          must: [
            { match: { 'pk.S': 'case|' } },
            { match: { 'sk.S': 'docket-entry|' } },
            {
              exists: {
                field: 'servedAt',
              },
            },
            ...queryParams,
          ],
        },
      },
      size: MAX_SEARCH_RESULTS,
    },
    index: 'efcms-docket-entry',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });
  return results;
};
