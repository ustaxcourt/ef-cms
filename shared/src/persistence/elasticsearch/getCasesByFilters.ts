import { CaseStatus, CaseType } from '../../business/entities/EntityConstants';

export const getCasesByFilters = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: {
    caseStatuses: CaseStatus[];
    caseTypes: CaseType[];
    createEndDate: string;
    createStartDate: string;
    filingMethod: 'all' | 'electronic' | 'paper';
  };
}) => {
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

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: filters,
          },
        },
        sort: [{ 'createdAt.S': 'asc' }],
      },
      index: 'efcms-case',
      size: 10000,
    },
  });
  return results;
};
