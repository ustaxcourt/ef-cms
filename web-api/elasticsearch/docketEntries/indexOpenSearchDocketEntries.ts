import { marshall } from '@aws-sdk/util-dynamodb';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { applicationContext } from '@web-api/applicationContext';
import { getSearchClient } from '@web-api/getSearchClient';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessage,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getDocument } from '@web-api/persistence/s3/getDocument';
import { chunk } from 'lodash';
import { efcmsDocketEntryIndex } from '../efcms-docket-entry-mappings';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

// Our indexing in OpenSearch is based on the pk/sk that existed in Dynamo.
function getPk<T extends RawDocketEntry>(docketEntry: T): string {
  return `case|${docketEntry.docketNumber}`;
}

function getSk<T extends RawDocketEntry>(docketEntry: T): string {
  return `docket-entry|${docketEntry.docketEntryId}`;
}

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

  const docketEntryIndexData: any[] = [];

  await Promise.all(
    fullDocketEntries.map(async docketEntry => {
      const doc = await formatDocketEntryForIndexing(docketEntry);
      // The OpenSearch bulk API expects an object for the operation followed by an object for what is to be operated on, e.g., [{doThis}, {someDocument}, {doThat}, {anotherDocument}]
      docketEntryIndexData.push({
        index: {
          _index: efcmsDocketEntryIndex,
          _id: `${getPk(docketEntry)}_${getSk(docketEntry)}`,
          routing: `${getPk(docketEntry)}_case|${getSk(docketEntry)}|mapping`,
        },
      });
      docketEntryIndexData.push(doc);
    }),
  );

  const CHUNK_SIZE = 50; // Make sure this is an even number
  const chunks = chunk(docketEntryIndexData, CHUNK_SIZE);
  await Promise.all(
    chunks.map(docketEntryChunk =>
      getSearchClient().bulk({ body: docketEntryChunk, refresh: false }),
    ),
  );
};

const formatDocketEntryForIndexing = async (
  docketEntry: RawDocketEntry & { documentContents?: any },
) => {
  const docketEntryToIndex: RawDocketEntry & {
    documentContents?: any;
  } = docketEntry;
  if (
    DocketEntry.isSearchable(docketEntry.eventCode) &&
    docketEntry.documentContentsId
  ) {
    // TODO: for performance, we should not re-index doc contents if we do not have to (use a contents hash?)
    try {
      const buffer = await getDocument({
        applicationContext,
        key: docketEntry.documentContentsId,
        useTempBucket: false,
      });
      const docketEntryDocument = new TextDecoder('utf-8').decode(buffer);

      const { documentContents } = JSON.parse(docketEntryDocument);

      docketEntryToIndex.documentContents = documentContents;
    } catch (err) {
      getDawsonLogger().error(
        `the s3 document of ${docketEntry.documentContentsId} was not found in s3`,
        { err },
      );
    }
  }

  const caseDocketEntryMappingRecordId = `${getPk(docketEntry)}_${getPk(docketEntry)}|mapping`;
  return {
    ...marshall(
      {
        ...docketEntryToIndex,
        pk: getPk(docketEntry),
        sk: getSk(docketEntry),
        entityName: 'DocketEntry',
      },
      { removeUndefinedValues: true },
    ),
    case_relations: {
      name: 'document',
      parent: caseDocketEntryMappingRecordId,
    },
  };
};
