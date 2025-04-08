import { marshall } from '@aws-sdk/util-dynamodb';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { applicationContext } from '@web-api/applicationContext';
import {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { getSearchClient } from '@web-api/getSearchClient';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessage,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
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

  const newDocketEntryRecords: IDynamoDBRecord[] = await Promise.all(
    fullDocketEntries.map(async docketEntry => {
      const docketEntryToIndex: RawDocketEntry & {
        documentContents?: any;
      } = docketEntry;
      if (
        DocketEntry.isSearchable(docketEntry.eventCode) &&
        docketEntry.documentContentsId
      ) {
        // TODO: for performance, we should not re-index doc contents if we do not have to (use a contents hash?)
        try {
          const buffer = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              key: docketEntry.documentContentsId,
              useTempBucket: false,
            });
          const docketEntryDocument = new TextDecoder('utf-8').decode(buffer);

          const { documentContents } = JSON.parse(docketEntryDocument);

          docketEntryToIndex.documentContents = documentContents;
        } catch (err) {
          applicationContext.logger.error(
            `the s3 document of ${docketEntry.documentContentsId} was not found in s3`,
            { err },
          );
        }
      }

      const caseDocketEntryMappingRecordId = `case|${docketEntry.docketNumber}_docket-entry|${docketEntry.docketEntryId}|mapping`;

      return {
        dynamodb: {
          Keys: {
            pk: {
              S: `case|${docketEntry.docketNumber}`,
            },
            sk: {
              S: `docket-entry|${docketEntry.docketEntryId}`,
            },
          },
          NewImage: {
            ...marshall(docketEntryToIndex),
            case_relations: {
              name: 'document',
              parent: caseDocketEntryMappingRecordId,
            },
          },
        },
        eventName: 'MODIFY',
      };
    }),
  );

  // ZACH AND CHRIS ARE HERE

  // const searchClient = getSearchClient();

  // const body: {
  //   index: { _index: string; _id: string; routing: string };
  //   doc: any;
  // }[] = fullDocketEntries.map(d => ({
  //   index: {
  //     _index: efcmsDocketEntryIndex,
  //     _id: `case|${d.docketNumber}_docket-entry|${d.docketEntryId}`,
  //     routing: `case|${d.docketNumber}_docket-entry|${d.docketEntryId}|mapping`,
  //   },
  //   doc: d,
  // }));

  // await searchClient.bulk({ body });
};
