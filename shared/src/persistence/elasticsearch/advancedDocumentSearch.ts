import { MAX_SEARCH_CLIENT_RESULTS } from '../../business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { getJudgeFilterForOpinionSearch } from './advancedDocumentSearchHelpers/getJudgeFilterForOpinionSearch';
import { getJudgeFilterForOrderSearch } from './advancedDocumentSearchHelpers/getJudgeFilterForOrderSearch';
import { getSealedQuery } from './advancedDocumentSearchHelpers/getSealedQuery';
import { getSortQuery } from './advancedDocumentSearchHelpers/getSortQuery';
import { search } from './searchClient';

const simpleQueryFlags = 'OR|AND|ESCAPE|PHRASE'; // OR|AND|NOT|PHRASE|ESCAPE|PRECEDENCE', // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#supported-flags

export type OrdersAndOpinionFormattedResultsTypes = {
  isCaseSealed: boolean;
  isDocketEntrySealed: boolean;
  isSealed: boolean | undefined;
  caseCaption: string;
  docketNumberWithSuffix: string;
  irsPractitioners: Object[];
  privatePractitioners: Array<{}>;
  petitioners: Object[];
  docketNumber: string;
  eventCode: string;
  signedJudgeName: string;
  isStricken: boolean;
  numberOfPages: number;
  documentType: string;
  filingDate: string;
  docketEntryId: string;
  documentTitle: string;
  isFileAttached: true;
  _score: null;
}[];

export const advancedDocumentSearch = async ({
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

  const documentMust = [];

  if (keyword) {
    documentMust.push({
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

  let documentMustNot = [{ term: { 'isStricken.BOOL': true } }];
  if (omitSealed) {
    const { sealedCaseQuery, sealedDocumentMustNotQuery } = getSealedQuery();

    caseQueryParams.has_parent.query.bool.filter.push(sealedCaseQuery);
    documentMustNot = [...documentMustNot, ...sealedDocumentMustNotQuery];
  } else {
    if (isExternalUser) {
      documentMustNot.push({
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

  documentMust.push(caseQueryParams);

  if (isOpinionSearch) {
    documentMustNot = [
      ...documentMustNot,
      {
        term: { 'isSealed.BOOL': true },
      },
    ];
  }

  const documentFilter: QueryDslQueryContainer[] = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    { term: { 'isFileAttached.BOOL': true } },
    { terms: { 'eventCode.S': documentEventCodes } },
  ];

  if (judge && judge !== 'All Judges') {
    const judgeName = judge.replace(/Chief\s|Legacy\s|Judge\s/g, '');
    if (isOpinionSearch) {
      const judgeFilter = getJudgeFilterForOpinionSearch({
        judgeName,
      });

      documentFilter.push(judgeFilter);
    } else {
      const judgeFilter = getJudgeFilterForOrderSearch({
        judgeName,
      });

      documentFilter.push(judgeFilter);
    }
  }

  if (endDate && startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${startDate}||/h`,
          lte: `${endDate}||/h`,
        },
      },
    });
  } else if (startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${startDate}||/h`,
        },
      },
    });
  }

  const searchQuery: QueryDslQueryContainer = {
    bool: {
      filter: documentFilter,
      must: documentMust,
      must_not: documentMustNot,
    },
  };

  const documentQuery = {
    body: {
      _source: sourceFields,
      from,
      query: searchQuery,
      size: overrideResultSize || MAX_SEARCH_CLIENT_RESULTS,
      sort: getSortQuery(sortField),
    },
    index: 'efcms-docket-entry',
  };

  const {
    results,
    total,
  }: { results: OrdersAndOpinionFormattedResultsTypes; total: number } =
    await search({
      applicationContext,
      searchParameters: documentQuery,
    });

  return { results, totalCount: total };
};
