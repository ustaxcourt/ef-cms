const {
  DOCUMENT_SEARCH_SORT,
  MAX_SEARCH_CLIENT_RESULTS,
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

exports.advancedDocumentSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  documentEventCodes,
  endDate,
  from = 0,
  isOpinionSearch = false,
  judge,
  keyword,
  omitSealed,
  opinionTypes,
  overrideResultSize,
  sortOrder: sortField,
  startDate,
}) => {
  const sourceFields = [
    'caseCaption',
    'docketEntryId',
    'docketNumber',
    'docketNumberWithSuffix',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'irsPractitioners',
    'isFileAttached',
    'isSealed',
    'isStricken',
    'judge',
    'numberOfPages',
    'petitioners',
    'privatePractitioners',
    'sealedDate',
    'sealedTo',
    'signedJudgeName',
  ];

  const documentQueryFilter = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    { terms: { 'eventCode.S': documentEventCodes } },
    { term: { 'isFileAttached.BOOL': true } },
  ];

  const docketEntryQueryParams = [];
  let docketEntryMustNot = [{ term: { 'isStricken.BOOL': true } }];
  const simpleQueryFlags = 'OR|AND|ESCAPE|PHRASE'; // OR|AND|NOT|PHRASE|ESCAPE|PRECEDENCE', // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#supported-flags

  if (keyword) {
    docketEntryQueryParams.push({
      simple_query_string: {
        default_operator: 'and',
        fields: ['documentContents.S', 'documentTitle.S'],
        flags: simpleQueryFlags,
        query: keyword,
      },
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
      query: {
        bool: {
          filter: [],
        },
      },
      score: true,
    },
  };

  if (omitSealed) {
    const caseMust = [
      {
        bool: {
          minimum_should_match: 1,
          should: [
            {
              bool: {
                must: {
                  term: { 'isSealed.BOOL': false },
                },
              },
            },
            {
              bool: {
                must_not: {
                  exists: { field: 'isSealed' },
                },
              },
            },
          ],
        },
      },
    ];

    const caseQuery = { bool: { must: caseMust } };

    docketEntryMustNot = [
      ...docketEntryMustNot,
      {
        term: { 'isSealed.BOOL': true },
      },
      {
        term: { 'sealedTo.S': 'External' },
      },
    ];
    caseQueryParams.has_parent.query.bool.filter.push(caseQuery);
  }

  if (docketNumber) {
    caseQueryParams.has_parent.query.bool.filter.push({
      term: { 'docketNumber.S': docketNumber },
    });
  } else if (caseTitleOrPetitioner) {
    caseQueryParams.has_parent.query.bool.must = {
      simple_query_string: {
        default_operator: 'and',
        fields: ['caseCaption.S', 'petitioners.L.M.name.S'],
        flags: simpleQueryFlags,
        query: caseTitleOrPetitioner,
      },
    };
  }

  docketEntryQueryParams.push(caseQueryParams);

  if (isOpinionSearch) {
    docketEntryMustNot = [
      ...docketEntryMustNot,
      {
        term: { 'isSealed.BOOL': true },
      },
    ];
  }

  if (judge) {
    const judgeName = judge.replace(/Chief\s|Legacy\s|Judge\s/g, '');
    if (isOpinionSearch) {
      docketEntryQueryParams.push({
        bool: {
          should: [
            {
              match: {
                [`${OPINION_JUDGE_FIELD}.S`]: judgeName,
              },
            },
            {
              match: {
                [`${ORDER_JUDGE_FIELD}.S`]: {
                  operator: 'and',
                  query: judgeName,
                },
              },
            },
          ],
        },
      });
    } else {
      docketEntryQueryParams.push({
        bool: {
          should: {
            match: {
              [`${ORDER_JUDGE_FIELD}.S`]: {
                operator: 'and',
                query: judgeName,
              },
            },
          },
        },
      });
    }
  }

  if (opinionTypes && opinionTypes.length) {
    if (opinionTypes.length === 1) {
      documentQueryFilter.push({
        term: { 'eventCode.S': opinionTypes[0] },
      });
    } else {
      documentQueryFilter.push({
        bool: {
          should: opinionTypes.map(opinionType => ({
            term: { 'eventCode.S': opinionType },
          })),
        },
      });
    }
  }

  if (endDate && startDate) {
    documentQueryFilter.push({
      range: {
        'filingDate.S': {
          gte: `${startDate}||/h`,
          lte: `${endDate}||/h`,
        },
      },
    });
  } else if (startDate) {
    documentQueryFilter.push({
      range: {
        'filingDate.S': {
          gte: `${startDate}||/h`,
        },
      },
    });
  }

  let sort;
  let sortOrder = 'desc';

  if (
    [
      DOCUMENT_SEARCH_SORT.FILING_DATE_ASC,
      DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC,
    ].includes(sortField)
  ) {
    sortOrder = 'asc';
  }

  switch (sortField) {
    case DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC:
      sort = [{ 'numberOfPages.N': sortOrder }];
      break;
    case DOCUMENT_SEARCH_SORT.FILING_DATE_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.FILING_DATE_DESC: // fall through
    default:
      sort = [{ 'filingDate.S': sortOrder }];
      break;
  }

  const documentQuery = {
    body: {
      _source: sourceFields,
      from,
      query: {
        bool: {
          filter: documentQueryFilter,
          must: docketEntryQueryParams,
          must_not: docketEntryMustNot,
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
