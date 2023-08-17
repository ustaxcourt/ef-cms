import {
  CavAndSubmittedCaseResponseType,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: JudgeActivityReportCavAndSubmittedCasesRequest;
}): Promise<CavAndSubmittedCaseResponseType> => {
  const source = [
    'docketNumber',
    'leadDocketNumber',
    'caseCaption',
    'caseStatusHistory',
    'docketNumberWithSuffix',
    'petitioners',
    'status',
  ];

  const mustFilters: QueryDslQueryContainer[] = [];
  const filters: QueryDslQueryContainer[] = [
    {
      terms: { 'status.S': params.statuses },
    },
  ];

  if (params.judges) {
    const shouldArray: Object[] = [];
    params.judges.forEach(judge => {
      const associatedJudgeFilters = {
        match_phrase: {
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
    mustFilters.push(shouldObject);
  }

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            filter: filters,
            must: mustFilters,
          },
        },
        sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      },
      index: 'efcms-case',
      size: MAX_ELASTICSEARCH_PAGINATION,
      track_total_hits: true,
    },
  });

  // console.log('searchResults', searchResults);

  return results;
};
