import {
  CaseInventory,
  GetCaseInventoryReportRequest,
} from '../../business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
// eslint-disable-next-line import/no-unresolved
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { formatResults } from './searchClient';

export const getCasesByFilters = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: GetCaseInventoryReportRequest;
}): Promise<{
  totalCount: number;
  foundCases: CaseInventory[];
  lastCaseId: number;
}> => {
  const source = [
    'associatedJudge',
    'isPaper',
    'createdAt',
    'procedureType',
    'caseCaption',
    'caseType',
    'docketNumber',
    'preferredTrialCity',
    'receivedAt',
    'status',
    'highPriority',
  ];

  const filters: QueryDslQueryContainer[] = [];

  const createDateFilter = {
    range: {
      'createdAt.S': {
        gte: params.startDate,
        lt: params.endDate,
      },
    },
  };
  filters.push(createDateFilter);

  if (params.caseStatuses.length) {
    const caseStatusesFilters = {
      terms: {
        'status.S': params.caseStatuses,
      },
    };
    filters.push(caseStatusesFilters);
  }

  if (params.caseTypes.length) {
    const caseTypeFilters = {
      terms: {
        'caseType.S': params.caseTypes,
      },
    };
    filters.push(caseTypeFilters);
  }

  if (params.filingMethod !== 'all') {
    const filingMethodFilter = {
      match: {
        'isPaper.BOOL': params.filingMethod === 'paper',
      },
    };
    filters.push(filingMethodFilter);
  }

  const searchResults = await applicationContext.getSearchClient().search({
    _source: source,
    body: {
      query: {
        bool: {
          must: filters,
        },
      },
      search_after: [params.searchAfter],
      sort: [{ 'createdAt.S': 'asc' }],
    },
    index: 'efcms-case',
    size: params.pageSize,
    track_total_hits: true,
  });

  const { results, total } = formatResults(searchResults.body);

  const matchingCases: any[] = searchResults.body.hits.hits;
  const lastCaseId =
    matchingCases.length === 0
      ? 0
      : matchingCases[matchingCases.length - 1].sort[0];

  return {
    foundCases: results,
    lastCaseId,
    totalCount: total,
  };
};
