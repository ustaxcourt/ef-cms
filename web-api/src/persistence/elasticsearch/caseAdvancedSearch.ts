import { MAX_CASE_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { aggregateCommonQueryParams } from '@web-api/business/utilities/aggregateCommonQueryParams';
import { search } from './searchClient';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import type { Common } from 'node_modules/@opensearch-project/opensearch/api/_types';
import type { Search_Request } from 'node_modules/@opensearch-project/opensearch/api';

type CaseAdvancedSearchResult = {
  caseCaption: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  irsPractitioners?: { userId?: string }[];
  isSealed?: boolean;
  petitioners: { name: string; state?: string }[];
  privatePractitioners?: { userId?: string }[];
  receivedAt: string;
  sealedDate?: string;
  sort?: Common.SortResults;
};

export const caseAdvancedSearch = async ({
  applicationContext,
  resultSize = MAX_CASE_SEARCH_RESULTS,
  searchAfter,
  searchTerms,
  useNonExactQuery = false,
}: {
  applicationContext: ServerApplicationContext;
  resultSize?: number;
  searchAfter?: Common.SortResults;
  searchTerms: CaseAdvancedSearchParamsRequestType;
  useNonExactQuery?: boolean;
}): Promise<CaseAdvancedSearchResult[]> => {
  const { commonQuery, exactMatchesQuery, nonExactMatchesQuery } =
    aggregateCommonQueryParams(searchTerms);

  const source = [
    'caseCaption',
    'petitioners',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'irsPractitioners',
    'isSealed',
    'privatePractitioners',
    'receivedAt',
    'sealedDate',
  ];

  const matchQuery = useNonExactQuery
    ? nonExactMatchesQuery
    : exactMatchesQuery;
  const body: NonNullable<Search_Request['body']> = {
    _source: source,
    query: { bool: { must: [...matchQuery, ...commonQuery] } },
    size: resultSize,
    sort: [
      { _score: { order: 'desc' } },
      { 'docketNumber.S': { order: 'asc' } },
    ],
  };

  if (searchAfter) {
    body.search_after = searchAfter;
  }

  const { results } = await search<CaseAdvancedSearchResult>({
    applicationContext,
    searchParameters: {
      body,
      index: 'efcms-case',
    },
  });

  return results;
};
