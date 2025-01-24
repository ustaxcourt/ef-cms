import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';
import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';
import { ServerApplicationContext } from '@web-api/applicationContext';

export type DocketNumberByStatusRequest = {
  statuses: string[];
  judges?: string[];
  excludeMemberCases?: boolean;
};

const source = [
  'caseCaption',
  'caseStatusHistory',
  'docketNumber',
  'docketNumberWithSuffix',
  'associatedJudge',
  'leadDocketNumber',
  'petitioners',
  'status',
] as const;

type CaseFields = (typeof source)[number];

export type SubmittedCAVTableFields = Pick<RawCase, CaseFields>;

export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  params,
}: {
  applicationContext: ServerApplicationContext;
  params: DocketNumberByStatusRequest;
}): Promise<SubmittedCAVTableFields[]> => {
  const shouldFilters: QueryContainer[] = [];
  const filters: QueryContainer[] = [
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
        _source: source as unknown as string[],
        query: {
          bool: {
            filter: filters,
            minimum_should_match: 1,
            should: shouldFilters,
          },
        },
        sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      },
      index: 'efcms-case',
      size: MAX_ELASTICSEARCH_PAGINATION,
    },
  });

  if (params.excludeMemberCases) {
    return results.filter(
      caseInfo =>
        !caseInfo.leadDocketNumber ||
        caseInfo.docketNumber === caseInfo.leadDocketNumber,
    );
  }

  return results;
};
