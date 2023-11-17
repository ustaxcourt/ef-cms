import {
  CaseInventory,
  GetCustomCaseReportRequest,
} from '../../business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
// eslint-disable-next-line import/no-unresolved
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { formatResults } from './searchClient';

export const getCasesByFilters = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: GetCustomCaseReportRequest;
}): Promise<{
  totalCount: number;
  foundCases: CaseInventory[];
  lastCaseId: { receivedAt: number; pk: string };
}> => {
  const source = [
    'associatedJudge',
    'isPaper',
    'procedureType',
    'caseCaption',
    'caseType',
    'docketNumber',
    'leadDocketNumber',
    'preferredTrialCity',
    'receivedAt',
    'status',
    'highPriority',
  ];

  const filters: QueryDslQueryContainer[] = [];

  const createDateFilter = {
    range: {
      'receivedAt.S': {
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

  if (params.preferredTrialCities.length) {
    const preferredTrialCityFilters = {
      terms: {
        'preferredTrialCity.S': params.preferredTrialCities,
      },
    };
    filters.push(preferredTrialCityFilters);
  }

  if (params.judges.length) {
    const shouldArray: Object[] = [];
    params.judges.forEach(judge => {
      const associatedJudgeFilters = {
        match: {
          'associatedJudge.S': judge,
        },
      };
      shouldArray.push(associatedJudgeFilters);
    });
    const shouldObject: QueryDslQueryContainer = {
      bool: {
        should: shouldArray,
      },
    };
    filters.push(shouldObject);
  }

  if (params.filingMethod !== 'all') {
    const filingMethodFilter = {
      match: {
        'isPaper.BOOL': params.filingMethod === 'paper',
      },
    };
    filters.push(filingMethodFilter);
  }

  if (params.procedureType !== 'All') {
    const procedureTypeFilter = {
      terms: {
        'procedureType.S': [params.procedureType],
      },
    };
    filters.push(procedureTypeFilter);
  }

  if (params.highPriority) {
    const procedureTypeFilter = {
      match: {
        'highPriority.BOOL': true,
      },
    };
    filters.push(procedureTypeFilter);
  }

  const searchResults = await applicationContext.getSearchClient().search({
    _source: source,
    body: {
      query: {
        bool: {
          must: filters,
        },
      },
      search_after: [params.searchAfter.receivedAt, params.searchAfter.pk],
      sort: [{ 'receivedAt.S': 'asc' }, { 'pk.S': 'asc' }],
    },
    index: 'efcms-case',
    size: params.pageSize,
    track_total_hits: true,
  });

  const { results, total } = formatResults(searchResults.body);

  const matchingCases: any[] = searchResults.body.hits.hits;
  const lastCase = matchingCases?.[matchingCases.length - 1];

  const lastCaseId = {
    pk: (lastCase?.sort[1] as string) || '',
    receivedAt: (lastCase?.sort[0] as number) || 0,
  };

  return {
    foundCases: results,
    lastCaseId,
    totalCount: total,
  };
};
