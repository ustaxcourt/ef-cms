import {
  CavAndSubmittedCaseResponseType,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
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
      search_after: [params.searchAfter],
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
    },
    index: 'efcms-case',
    size: params.pageSize,
    track_total_hits: true,
  });

  const { results } = formatResults(searchResults.body);

  const matchingCases: any[] = searchResults.body.hits.hits;
  const lastCase = matchingCases?.[matchingCases.length - 1];

  const lastDocketNumberForCavAndSubmittedCasesSearch =
    (lastCase?.sort[0] as number) || 0;

  return {
    foundCases: results,
    lastDocketNumberForCavAndSubmittedCasesSearch,
  };
};
