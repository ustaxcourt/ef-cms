import { getSearchClient } from '@web-api/getSearchClient';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessage,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { efcmsDocketEntryIndex } from 'web-api/elasticsearch/efcms-docket-entry-mappings';

export const transformOpenSearchDocketEntry = (
  docketEntryData: DocketEntryKysely | DocketEntryKysely[],
): { docketNumber: string; docketEntryId: string }[] => {
  const docketEntryArray = Array.isArray(docketEntryData)
    ? docketEntryData
    : [docketEntryData];
  return docketEntryArray.map(d => ({
    docketNumber: d.docketNumber,
    docketEntryId: d.docketEntryId,
  }));
};

export const indexOpenSearchDocketEntries = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  if (message.action == OPENSEARCH_SYNC_ACTIONS.DELETE) {
    return await deleteDocketEntriesFromOpenSearch({ message });
  }
  if (message.action == OPENSEARCH_SYNC_ACTIONS.UPSERT) {
    return await upsertDocketEntriesInOpenSearch({ message });
  }
};

const deleteDocketEntriesFromOpenSearch = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  // eslint-disable-next-line prefer-destructuring
  const payload: { docketNumber: string; docketEntryId: string }[] =
    message.payload;
  const body: { delete: { _index: string; _id: string } }[] = payload.map(
    ({ docketNumber, docketEntryId }) => ({
      delete: {
        _index: efcmsDocketEntryIndex,
        _id: `case|${docketNumber}_docket-entry|${docketEntryId}`,
      },
    }),
  );

  await getSearchClient().bulk({
    body,
    refresh: false,
  });
};

const upsertDocketEntriesInOpenSearch = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  // eslint-disable-next-line prefer-destructuring
  const payload: { docketNumber: string; docketEntryId: string }[] =
    message.payload;
  const fullDocketEntries =
    await getDocketEntriesByDocketNumberAndDocketEntryId({
      docketNumbersAndIds: payload,
    });

  const searchClient = getSearchClient();

  // 10494: ZACH AND CHRIS YOU ARE HERE
  const body: { delete: { _index: string; _id: string } }[] = [];

  await searchClient.bulk({ body: [{ index: {} }] });
};
