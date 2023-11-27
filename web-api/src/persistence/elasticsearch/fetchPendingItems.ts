import {
  PendingItem,
  pendingItemCaseSource,
  pendingItemDocketEntrySource,
} from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { UNSERVABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';

export const fetchPendingItems = async ({
  applicationContext,
  docketNumber,
  judge,
  page,
}: {
  applicationContext: IApplicationContext;
  docketNumber?: string;
  judge?: string;
  page?: number;
}): Promise<{ foundDocuments: PendingItem[]; total: number }> => {
  const { PENDING_ITEMS_PAGE_SIZE } = applicationContext.getConstants();

  const size = page ? PENDING_ITEMS_PAGE_SIZE : 5000;

  const from = page ? page * size : undefined;

  const mustFilters: QueryDslQueryContainer[] = [];
  mustFilters.push({ term: { 'entityName.S': 'DocketEntry' } });
  mustFilters.push({ term: { 'pending.BOOL': true } });

  const hasParentParam: QueryDslQueryContainer = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: pendingItemCaseSource as unknown as string[],
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };
  if (judge) {
    hasParentParam.has_parent!.query = {
      bool: {
        must: [
          {
            match_phrase: { 'associatedJudge.S': judge },
          },
        ],
      },
    };
  }
  mustFilters.push(hasParentParam);

  if (docketNumber) {
    mustFilters.push({ term: { 'docketNumber.S': docketNumber } });
  }

  const searchParameters = {
    body: {
      _source: pendingItemDocketEntrySource,
      from,
      query: {
        bool: {
          must: [
            ...mustFilters,
            {
              bool: {
                should: [
                  {
                    bool: {
                      minimum_should_match: 1,
                      should: [
                        {
                          exists: {
                            field: 'servedAt',
                          },
                        },
                        { term: { 'isLegacyServed.BOOL': true } },
                      ],
                    },
                  },
                  { terms: { 'eventCode.S': UNSERVABLE_EVENT_CODES } },
                ],
              },
            },
          ],
        },
      },
      size,
      sort: [
        {
          'receivedAt.S': {
            order: 'asc',
          },
        },
        {
          'docketEntryId.S': {
            order: 'asc',
          },
        },
      ],
    },
    index: 'efcms-docket-entry',
  };

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return { foundDocuments: results, total };
};
