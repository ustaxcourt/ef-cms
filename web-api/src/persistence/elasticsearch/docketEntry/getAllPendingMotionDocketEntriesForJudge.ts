import { MOTION_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { pendingItemCaseSource } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

export const getAllPendingMotionDocketEntriesForJudge = async ({
  applicationContext,
  judge,
}: {
  applicationContext: IApplicationContext;
  judge: string;
}): Promise<{ results: RawDocketEntry[]; total: number }> => {
  const filterDate = calculateISODate({ howMuch: -180 });

  const hasParentParam: QueryDslQueryContainer = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: pendingItemCaseSource as unknown as string[],
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: {
        bool: {
          must: [
            {
              match_phrase: { 'associatedJudge.S': judge },
            },
          ],
        },
      },
    },
  };

  const searchParameters = {
    body: {
      query: {
        bool: {
          must: [
            hasParentParam,
            {
              term: {
                'pending.BOOL': true,
              },
            },
            {
              range: {
                'createdAt.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  lte: filterDate,
                },
              },
            },
            {
              terms: {
                'eventCode.S': MOTION_EVENT_CODES,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
  };

  const { results, total } = await searchAll({
    applicationContext,
    searchParameters,
  });

  return { results, total };
};
