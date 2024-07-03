import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import type { IDynamoDBRecord } from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * fetches the latest version of the case from dynamodb and re-indexes this docket-entries combined with the latest case info.
 *
 * @param {array} docketEntryRecords all of the event stream records associated with docket entries
 */
export const processDocketEntries = async ({
  applicationContext,
  docketEntryRecords: records,
}: {
  applicationContext: ServerApplicationContext;
  docketEntryRecords: any[];
}) => {
  if (!records.length) return;

  applicationContext.logger.debug(
    `going to index ${records.length} docketEntryRecords`,
  );

  const newDocketEntryRecords: IDynamoDBRecord[] = await Promise.all(
    records.map(async record => {
      const fullDocketEntry = unmarshall(record.dynamodb.NewImage);

      if (
        DocketEntry.isSearchable(fullDocketEntry.eventCode) &&
        fullDocketEntry.documentContentsId
      ) {
        // TODO: for performance, we should not re-index doc contents if we do not have to (use a contents hash?)
        try {
          const buffer = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              key: fullDocketEntry.documentContentsId,
              useTempBucket: false,
            });
          const docketEntry = new TextDecoder('utf-8').decode(buffer);

          const { documentContents } = JSON.parse(docketEntry);

          fullDocketEntry.documentContents = documentContents;
        } catch (err) {
          applicationContext.logger.error(
            `the s3 document of ${fullDocketEntry.documentContentsId} was not found in s3`,
            { err },
          );
        }
      }

      const caseDocketEntryMappingRecordId = `${fullDocketEntry.pk}_${fullDocketEntry.pk}|mapping`;

      return {
        dynamodb: {
          Keys: {
            pk: {
              S: fullDocketEntry.pk,
            },
            sk: {
              S: fullDocketEntry.sk,
            },
          },
          NewImage: {
            ...marshall(fullDocketEntry),
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

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: newDocketEntryRecords,
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error(
      'the docket entry records that failed to index',
      { failedRecords },
    );
    throw new Error('failed to index docket entry records');
  }
};
