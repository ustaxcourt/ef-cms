import {
  CaseInventory,
  GetCaseInventoryReportRequest,
} from '../../business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
// eslint-disable-next-line import/no-unresolved
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export const getCasesByFilters = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: GetCaseInventoryReportRequest;
}): Promise<{ totalCount: number; foundCases: CaseInventory[] }> => {
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
        gte: params.createStartDate,
        lt: params.createEndDate,
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

  const { results, total } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            must: filters,
          },
        },
        sort: [{ 'createdAt.S': 'asc' }],
      },
      from: params.pageNumber * params.pageSize,
      index: 'efcms-case',
      size: params.pageSize,
      track_total_hits: true, // to allow the count on the case inventory report UI to be accurate
    },
  });

  return {
    foundCases: results,
    totalCount: total,
  };
};
