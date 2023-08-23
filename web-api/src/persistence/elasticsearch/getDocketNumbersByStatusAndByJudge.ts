import { CavAndSubmittedCaseResponseType } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export type DocketNumberByStatusRequest = {
  statuses: string[];
  judges?: string[];
};

export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: DocketNumberByStatusRequest;
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

  const shouldFilters: QueryDslQueryContainer[] = [];
  const filters: QueryDslQueryContainer[] = [
    {
      terms: { 'status.S': params.statuses },
    },
  ];

  if (params.judges) {
    params.judges.forEach(judge => {
      const associatedJudgeFilters = {
        match_phrase: {
          'associatedJudge.S': judge,
        },
      };
      shouldFilters.push(associatedJudgeFilters);
    });
  }

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            filter: filters,
            should: shouldFilters,
          },
        },
        sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      },
      index: 'efcms-case',
      size: MAX_ELASTICSEARCH_PAGINATION,
    },
  });

  return results;
};
