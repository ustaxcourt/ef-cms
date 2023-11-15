import {
  PendingItem,
  pendingItemCaseSource,
  pendingItemDocketEntrySource,
} from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { UNSERVABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';

export const fetchPendingItems = async ({
  applicationContext,
  judge,
  page,
  unservableEventCodes,
}: {
  applicationContext: IApplicationContext;
  judge?: string;
  page?: number;
  unservableEventCodes: typeof UNSERVABLE_EVENT_CODES;
}): Promise<{ foundDocuments: PendingItem[]; total: number }> => {
  const { PENDING_ITEMS_PAGE_SIZE } = applicationContext.getConstants();

  const size = page ? PENDING_ITEMS_PAGE_SIZE : 5000;

  const from = page ? page * size : undefined;

  const hasParentParam = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: pendingItemCaseSource,
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };

  const searchParameters = {
    body: {
      _source: pendingItemDocketEntrySource,
      from,
      query: {
        bool: {
          must: [
            { term: { 'entityName.S': 'DocketEntry' } },
            { term: { 'pending.BOOL': true } },
            hasParentParam,
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
                  { terms: { 'eventCode.S': unservableEventCodes } },
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

  if (judge) {
    hasParentParam.has_parent.query = {
      bool: {
        must: [
          {
            match_phrase: { 'associatedJudge.S': judge },
          },
        ],
      },
    };
  }

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return { foundDocuments: results, total };
};
