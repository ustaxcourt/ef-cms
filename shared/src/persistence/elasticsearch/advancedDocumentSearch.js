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
  omitSealed,
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
        fields: ['documentContents.S', 'documentTitle.S'],
        query: keyword,
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
    },
  };

  if (docketNumber) {
    caseQueryParams.has_parent.query.bool.must = {
      match: { 'docketNumber.S': { operator: 'and', query: docketNumber } },
    };
  } else if (caseTitleOrPetitioner) {
    caseQueryParams.has_parent.query.bool.must = {
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
    } else if (judgeType === 'signedJudgeName') {
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
            ...docketEntryQueryParams,
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
