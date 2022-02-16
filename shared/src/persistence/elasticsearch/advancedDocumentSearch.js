/* eslint-disable complexity */
const {
  DOCUMENT_SEARCH_SORT,
  MAX_SEARCH_CLIENT_RESULTS,
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

const getSealedQuery = ({ caseQueryParams, docketEntryMustNot }) => {
  docketEntryMustNot.push({
    term: { 'isSealed.BOOL': true },
  });
  docketEntryMustNot.push({
    term: { 'sealedTo.S': 'External' },
  });

  caseQueryParams.has_parent.query.bool.filter.push({
    bool: {
      must: [
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
      ],
    },
  });
};

const getSortQuery = sortField => {
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

  return sort;
};

const getJudgeFilterForOpinionSearch = ({
  docketEntryQueryParams,
  judgeName,
}) => {
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
};

const getJudgeFilterForOrderSearch = ({
  docketEntryQueryParams,
  judgeName,
}) => {
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
};

const simpleQueryFlags = 'OR|AND|ESCAPE|PHRASE'; // OR|AND|NOT|PHRASE|ESCAPE|PRECEDENCE', // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#supported-flags

exports.advancedDocumentSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  documentEventCodes,
  endDate,
  from = 0,
  isExternalUser,
  isOpinionSearch = false,
  judge,
  keyword,
  omitSealed,
  opinionTypes,
  overrideResultSize,
  sortField,
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

  const docketEntryQueryParams = [];

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

  let caseQueryParams = {
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

  let docketEntryMustNot = [{ term: { 'isStricken.BOOL': true } }];
  if (omitSealed) {
    getSealedQuery({ caseQueryParams, docketEntryMustNot });
  } else {
    if (isExternalUser) {
      docketEntryMustNot.push({
        term: { 'sealedTo.S': 'External' },
      });
    }
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
      getJudgeFilterForOpinionSearch({ docketEntryQueryParams, judgeName });
    } else {
      getJudgeFilterForOrderSearch({ docketEntryQueryParams, judgeName });
    }
  }

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
      sort: getSortQuery(sortField),
    },
    index: 'efcms-docket-entry',
  };

  const { results, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  return { results, totalCount: total };
};
