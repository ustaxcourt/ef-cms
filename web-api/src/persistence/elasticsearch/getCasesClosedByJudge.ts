import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export const getCasesClosedByJudge = async ({
  applicationContext,
  endDate,
  judges,
  startDate,
}) => {
  const source = ['status'];

  const shouldFilters: QueryDslQueryContainer[] = [];

  // TODO: is it safe to assume we'll always use this method with judges provided?
  // How do we enforce that?
  // Do we test the logging?
  if (judges.length) {
    judges.forEach(judge => {
      shouldFilters.push({
        match_phrase: { 'associatedJudge.S': `${judge}` },
      });
    });
  }

  const documentQuery = {
    body: {
      _source: source,
      aggs: {
        closed_cases: {
          terms: {
            field: 'status.S',
          },
        },
      },
      query: {
        bool: {
          filter: [
            {
              range: {
                'closedDate.S': {
                  gte: `${startDate}||/h`,
                  lte: `${endDate}||/h`,
                },
              },
            },
          ],
          minimum_should_match: 1,
          should: shouldFilters,
        },
      },
      size: 0,
    },
    index: 'efcms-case',
  };

  const { aggregations, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  const judgeNameToLog =
    judges.length > 1 ? 'all judges' : `judge ${judges[0]}`;

  applicationContext.logger.info(
    `Found ${total} closed cases associated with ${judgeNameToLog}`,
  );

  return { aggregations, total };
};
