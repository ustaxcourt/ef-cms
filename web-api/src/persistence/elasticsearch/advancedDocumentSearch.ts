import {
  MAX_SEARCH_CLIENT_RESULTS,
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} from '../../../../shared/src/business/entities/EntityConstants';
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

// TODO about types
// 1. decide what are optional
// 2. Type documentEventCodes
export type AdvancedSearchArgsTypes = {
  applicationContext: IApplicationContext;
  from: number; // check if string (or both)
  endDate: string;
  isOpinionSearch: boolean;
  startDate: string;
  sortField: string;
  docketNumber: string;
  isExternalUser: boolean;
  keyword: string;
  caseTitleOrPetitioner: string;
  judge: string;
  judges: string[];
  overrideResultSize: number;
  omitSealed: boolean;
  documentEventCodes: any;
};

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
  judges,
  keyword,
  omitSealed,
  overrideResultSize,
  sortField,
  startDate,
}: AdvancedSearchArgsTypes) => {
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
  const shouldFilter = [];
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

  let caseQueryParams: any = {
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

  if (judge) {
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

  if (judges) {
    judges.forEach(judgeName => {
      const matchedQueryForJudge = isOpinionSearch
        ? {
            match: {
              [`${OPINION_JUDGE_FIELD}.S`]: judgeName,
            },
          }
        : {
            match: {
              [`${ORDER_JUDGE_FIELD}.S`]: {
                operator: 'and',
                query: judgeName,
              },
            },
          };
      shouldFilter.push(matchedQueryForJudge);
    });
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
      should: shouldFilter,
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
  }: { results: OrdersAndOpinionFormattedResultsTypes; total?: number } =
    await search({
      applicationContext,
      searchParameters: documentQuery,
    });

  return { results, totalCount: total };
};
