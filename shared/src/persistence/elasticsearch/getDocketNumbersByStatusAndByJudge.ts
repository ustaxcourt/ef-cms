import {
  CavAndSubmittedCaseResponseType,
  JudgeActivityReportCavAndSubmittedCasesRequestType,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { formatResults } from './searchClient';

export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: JudgeActivityReportCavAndSubmittedCasesRequestType;
}): Promise<CavAndSubmittedCaseResponseType> => {
  const source = ['docketNumber'];

  const filters: QueryDslQueryContainer[] = [
    {
      terms: { 'status.S': params.statuses },
    },
  ];

  if (params.judgeName !== 'All Judges') {
    filters.push({
      match_phrase: { 'associatedJudge.S': `${params.judgeName}` },
    });
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
