import { cloneDeep, compact } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';
import type { IDynamoDBRecord } from '@shared/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processMessageEntries = async ({
  applicationContext,
  messageRecords,
}: {
  applicationContext: ServerApplicationContext;
  messageRecords: any[];
}) => {
  if (!messageRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${messageRecords.length} message records`,
  );

  const indexMessageEntry = async (
    messageRecord: any,
  ): Promise<IDynamoDBRecord> => {
    const messageNewImage = messageRecord.dynamodb.NewImage;

    const caseMessageMappingRecordId = `${messageNewImage.pk.S}_${messageNewImage.pk.S}|mapping`;

    const caseMessageMappingRecord = {
      case_relations: {
        name: 'message',
        parent: caseMessageMappingRecordId,
      },
    };

    let NewImage = cloneDeep(messageNewImage);

    // go get the latest message - it might
    // have been updated in dynamo since this record was created to be processed
    if (!messageNewImage.isRepliedTo.BOOL) {
      const latestMessageData = await applicationContext
        .getPersistenceGateway()
        .getMessageById({
          applicationContext,
          docketNumber: messageNewImage.docketNumber.S,
          messageId: messageNewImage.messageId.S,
        });

      if (!latestMessageData.isRepliedTo) {
        NewImage = marshall(latestMessageData);
      }
    }
    return {
      dynamodb: {
        Keys: {
          pk: {
            S: messageNewImage.pk.S,
          },
          sk: {
            S: messageNewImage.sk.S,
          },
        },
        NewImage: {
          ...NewImage,
          ...caseMessageMappingRecord,
        },
      },
      eventName: 'MODIFY',
    };
  };

  const indexRecords: IDynamoDBRecord[] = await Promise.all(
    messageRecords.map(indexMessageEntry),
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: compact(indexRecords),
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to index', {
      failedRecords,
    });
    throw new Error('failed to index message records');
  }
};
