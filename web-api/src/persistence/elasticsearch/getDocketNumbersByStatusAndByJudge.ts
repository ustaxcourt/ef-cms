import {
  CavAndSubmittedCaseResponseType,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '@web-client/presenter/judgeActivityReportState';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { formatResults } from './searchClient';

export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: JudgeActivityReportCavAndSubmittedCasesRequest;
}): Promise<CavAndSubmittedCaseResponseType> => {
  const source = ['docketNumber'];

  const mustFilters: QueryDslQueryContainer[] = [];
  const filters: QueryDslQueryContainer[] = [
    {
      terms: { 'status.S': params.statuses },
    },
  ];

  if (params.judges.length) {
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

  const searchResults = await applicationContext.getSearchClient().search({
    _source: source,
    body: {
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
  });

  const { results } = formatResults(searchResults.body);

  return {
    foundCases: results,
  };
};
