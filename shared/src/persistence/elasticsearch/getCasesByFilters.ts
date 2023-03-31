import { GetCaseInventoryReportInteractorRequest } from '../../business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

export const getCasesByFilters = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: GetCaseInventoryReportInteractorRequest;
}): Promise<{ totalCount: number; foundCases: any[] }> => {
  // TODO: Make type for foundCases

  const source = [
    'associatedJudge',
    'isPaper',
    'createdAt',
    'procedureType',
    'caseType',
    'caseTitle',
    'docketNumber',
    'preferredTrialCity',
    'receivedAt',
    'status',
    'highPriority',
  ];

  const filters = [];

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
      index: 'efcms-case',
      size: 10000,
      track_total_hits: true, // to allow the count on the case inventory report UI to be accurate
    },
  });

  return {
    foundCases: results,
    totalCount: total,
  };
};
