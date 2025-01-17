import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import {
  PendingItem,
  pendingItemCaseSource,
  pendingItemDocketEntrySource,
} from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { UNSERVABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';
import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Search_Request } from '@opensearch-project/opensearch/api';

export const fetchPendingItems = async ({
  applicationContext,
  docketNumber,
  judge,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber?: string;
  judge?: string;
}): Promise<{ foundDocuments: PendingItem[] }> => {
  const mustFilters: QueryContainer[] = [];
  mustFilters.push({ term: { 'entityName.S': 'DocketEntry' } });
  mustFilters.push({ term: { 'pending.BOOL': true } });

  const hasParentParam: QueryContainer = {
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

  const searchParameters: Search_Request = {
    body: {
      _source: pendingItemDocketEntrySource as unknown as string[],
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
    size: MAX_ELASTICSEARCH_PAGINATION,
  };

  const { results } = await search({
    applicationContext,
    searchParameters,
  });

  return { foundDocuments: results };
};
