import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import {
  CaseInventory,
  GetCustomCaseReportRequest,
} from '../../business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
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

  const mustClause: QueryDslQueryContainer[] = [];

  const createDateFilter = {
    range: {
      'receivedAt.S': {
        gte: params.startDate,
        lt: params.endDate,
      },
    },
  };
  mustClause.push(createDateFilter);

  if (params.caseStatuses.length) {
    const caseStatusesFilters = {
      terms: {
        'status.S': params.caseStatuses,
      },
    };
    mustClause.push(caseStatusesFilters);
  }

  if (params.caseTypes.length) {
    const caseTypeFilters = {
      terms: {
        'caseType.S': params.caseTypes,
      },
    };
    mustClause.push(caseTypeFilters);
  }

  if (params.preferredTrialCities.length) {
    const preferredTrialCityFilters = {
      terms: {
        'preferredTrialCity.S': params.preferredTrialCities,
      },
    };
    mustClause.push(preferredTrialCityFilters);
  }

  if (params.judges.length) {
    let judgesSelection = params.judges;
    const shouldArray: Object[] = [];

    if (judgesSelection.includes(CHIEF_JUDGE)) {
      const associatedJudgeFilters = {
        match: {
          'associatedJudge.S': {
            operator: 'and',
            query: CHIEF_JUDGE,
          },
        },
      };
      shouldArray.push(associatedJudgeFilters);

      const judgesSelectionIds = judgesSelection.filter(
        judge => judge !== CHIEF_JUDGE,
      );
      shouldArray.push({
        terms: {
          'associatedJudgeId.S': judgesSelectionIds,
        },
      });
      const shouldObject: QueryDslQueryContainer = {
        bool: {
          should: shouldArray,
        },
      };
      mustClause.push(shouldObject);
    } else {
      mustClause.push({
        terms: {
          'associatedJudgeId.S': judgesSelection,
        },
      });
    }
  }

  if (params.filingMethod !== 'all') {
    const filingMethodFilter = {
      match: {
        'isPaper.BOOL': params.filingMethod === 'paper',
      },
    };
    mustClause.push(filingMethodFilter);
  }

  if (params.procedureType !== 'All') {
    const procedureTypeFilter = {
      terms: {
        'procedureType.S': [params.procedureType],
      },
    };
    mustClause.push(procedureTypeFilter);
  }

  if (params.highPriority) {
    const procedureTypeFilter = {
      match: {
        'highPriority.BOOL': true,
      },
    };
    mustClause.push(procedureTypeFilter);
  }

  const searchResults = await applicationContext.getSearchClient().search({
    _source: source,
    body: {
      query: {
        bool: {
          must: mustClause,
        },
      },
      search_after: [params.searchAfter.receivedAt, params.searchAfter.pk],
      sort: [{ 'receivedAt.S': 'asc' }, { 'pk.S': 'asc' }],
    },
    index: 'efcms-case',
    size: params.pageSize,
    track_total_hits: true,
  });

  const { results, total }: { results: CaseInventory[]; total: number } =
    formatResults(searchResults.body);

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
