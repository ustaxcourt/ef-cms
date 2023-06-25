import { JudgeActivityReportCavAndSubmittedCasesRequestType } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { formatResults } from './searchClient';

export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: JudgeActivityReportCavAndSubmittedCasesRequestType;
}): Promise<{
  totalCount: number;
  foundCases: { docketNumber: string }[];
  lastIdOfPage: { docketNumber: number };
}> => {
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
    body: {
      _source: source,
      query: {
        bool: {
          must: filters,
        },
      },
      size: 10000,
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      track_total_hits: true, // to allow the count on the case inventory report UI to be accurate
    },
    index: 'efcms-case',
  });

  const { results, total } = formatResults(searchResults.body);

  const matchingCases: any[] = searchResults.body.hits.hits;
  const lastCase = matchingCases?.[matchingCases.length - 1];

  const lastIdOfPage = {
    docketNumber: (lastCase?.sort[0] as number) || 0,
  };

  return {
    foundCases: results,
    lastIdOfPage,
    totalCount: total,
  };
};
