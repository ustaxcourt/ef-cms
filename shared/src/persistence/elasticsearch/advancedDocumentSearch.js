const {
  DOCUMENT_SEARCH_SORT,
  MAX_SEARCH_CLIENT_RESULTS,
  ORDER_JUDGE_FIELD,
} = require('../../business/entities/EntityConstants');
const {
  removeAdvancedSyntaxSymbols,
} = require('../../business/utilities/aggregateCommonQueryParams');
const { search } = require('./searchClient');

exports.advancedDocumentSearch = async ({
  applicationContext,
  documentEventCodes,
  endDate,
  from = 0,
  judge,
  judgeType,
  keyword,
  opinionType,
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
    'isSealed',
    'isStricken',
    'judge',
    'numberOfPages',
    'privatePractitioners',
    'sealedDate',
    'signedJudgeName',
  ];

  const filter = [
    { term: { 'entityName.S': 'DocketEntry' } },
    { term: { 'isStricken.BOOL': false } },
    { term: { 'isCaseSealed.BOOL': false } },
    { terms: { 'eventCode.S': documentEventCodes } },
    {
      exists: {
        field: 'servedAt',
      },
    },
  ];
  if (opinionType) {
    filter.push({ term: { 'documentType.S': opinionType } });
  }

  if (endDate && startDate) {
    filter.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
          lte: endDate,
        },
      },
    });
  } else if (startDate) {
    filter.push({
      range: {
        'filingDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
        },
      },
    });
  }

  const docketEntryQueryParams = [];

  if (keyword) {
    docketEntryQueryParams.push({
      simple_query_string: {
        default_operator: 'and',
        fields: ['documentContents.S', 'documentTitle.S'],
        query: removeAdvancedSyntaxSymbols(keyword),
      },
    });
  }

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
          filter,
          must: docketEntryQueryParams,
        },
      },
      size: overrideResultSize || MAX_SEARCH_CLIENT_RESULTS,
      sort,
    },
    index: process.env.DOCKET_ENTRY_INDEX || 'efcms-docket-entry-no-parent',
  };

  applicationContext.logger.info('query', documentQuery);

  const { results, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  return { results, totalCount: total };
};
