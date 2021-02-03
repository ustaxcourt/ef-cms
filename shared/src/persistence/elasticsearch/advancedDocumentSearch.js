const {
  MAX_SEARCH_CLIENT_RESULTS,
  ORDER_JUDGE_FIELD,
} = require('../../business/entities/EntityConstants');
const {
  removeAdvancedSyntaxSymbols,
} = require('../../business/utilities/aggregateCommonQueryParams');
const { search } = require('./searchClient');

exports.advancedDocumentSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  documentEventCodes,
  endDate,
  from = 0,
  judge,
  judgeType,
  keyword,
  omitSealed,
  opinionType,
  overrideResultSize,
  overrideSort = false,
  startDate,
}) => {
  const sourceFields = [
    'caseCaption',
    'contactPrimary',
    'contactSecondary',
    'docketEntryId',
    'docketNumber',
    'docketNumberWithSuffix',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'irsPractitioners',
    'isSealed',
    'isStricken',
    'judge',
    'numberOfPages',
    'privatePractitioners',
    'sealedDate',
    'signedJudgeName',
  ];

  const docketEntryQueryParams = [
    {
      bool: {
        must_not: [
          {
            term: { 'isStricken.BOOL': true },
          },
        ],
        should: documentEventCodes.map(eventCode => ({
          match: {
            'eventCode.S': eventCode,
          },
        })),
      },
    },
  ];
  const caseMustNot = [];

  if (keyword) {
    docketEntryQueryParams.push({
      simple_query_string: {
        default_operator: 'and',
        fields: ['documentContents.S', 'documentTitle.S'],
        query: removeAdvancedSyntaxSymbols(keyword),
      },
    });
  }

  if (omitSealed) {
    caseMustNot.push({
      term: { 'isSealed.BOOL': true },
    });
  }
  const caseQueryParams = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: sourceFields,
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { bool: { must_not: caseMustNot } },
      score: true,
    },
  };

  if (docketNumber) {
    caseQueryParams.has_parent.query.bool.must = {
      match: { 'docketNumber.S': { operator: 'and', query: docketNumber } },
    };
  } else if (caseTitleOrPetitioner) {
    caseQueryParams.has_parent.query.bool.must = {
      simple_query_string: {
        default_operator: 'and',

        fields: [
          'caseCaption.S',
          'contactPrimary.M.name.S',
          'contactSecondary.M.name.S',
        ],
        query: removeAdvancedSyntaxSymbols(caseTitleOrPetitioner),
      },
    };
  }

  docketEntryQueryParams.push(caseQueryParams);

  if (judge) {
    const judgeName = judge.replace(/Chief\s|Legacy\s|Judge\s/g, '');
    const judgeField = `${judgeType}.S`;
    if (judgeType === 'judge') {
      docketEntryQueryParams.push({
        bool: {
          should: {
            match: {
              [judgeField]: judgeName,
            },
          },
        },
      });
    } else if (judgeType === ORDER_JUDGE_FIELD) {
      docketEntryQueryParams.push({
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
  }

  if (opinionType) {
    docketEntryQueryParams.push({
      match: {
        'documentType.S': {
          operator: 'and',
          query: opinionType,
        },
      },
    });
  }

  if (startDate) {
    docketEntryQueryParams.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
        },
      },
    });
  }

  if (endDate && startDate) {
    docketEntryQueryParams.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          lte: endDate,
        },
      },
    });
  }

  let sort;

  if (overrideSort) {
    sort = [{ 'filingDate.S': { order: 'desc' } }];
  }

  const documentQuery = {
    body: {
      _source: sourceFields,
      from,
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
            ...docketEntryQueryParams,
          ],
        },
      },
      size: overrideResultSize || MAX_SEARCH_CLIENT_RESULTS,
      sort,
    },
    index: 'efcms-docket-entry',
  };

  const { results, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  return { results, totalCount: total };
};
