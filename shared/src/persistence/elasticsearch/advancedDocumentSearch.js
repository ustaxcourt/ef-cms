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
  isOpinionSearch,
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
    'petitioners',
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
    'privatePractitioners',
    'sealedDate',
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
  const caseMustNot = [];
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
      query: { bool: { filter: [], must_not: caseMustNot } },
      score: true,
    },
  };

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
          must_not: [{ term: { 'isStricken.BOOL': true } }],
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
