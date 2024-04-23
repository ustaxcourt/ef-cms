import { compact } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';

export const processMessageEntries = async ({
  applicationContext,
  messageRecords,
}: {
  applicationContext: IApplicationContext;
  messageRecords: any[];
}) => {
  if (!messageRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${messageRecords.length} message records`,
  );

  const indexMessageEntry = async messageRecord => {
    const messageNewImage = messageRecord.dynamodb.NewImage;

    const caseMessageMappingRecordId = `${messageNewImage.pk.S}_${messageNewImage.pk.S}|mapping`;

    const caseMessageMappingRecord = {
      case_relations: {
        name: 'message',
        parent: caseMessageMappingRecordId,
      },
    };

    // go get the latest message if we're indexing a message with isRepliedTo set to false - it might
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
        const marshalledMessage = marshall(latestMessageData);

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
              ...marshalledMessage,
              ...caseMessageMappingRecord,
            },
          },
          eventName: 'MODIFY',
        };
      }
    } else {
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
            ...messageNewImage,
            ...caseMessageMappingRecord,
          },
        },
        eventName: 'MODIFY',
      };
    }
  };

  const indexRecords = await Promise.all(messageRecords.map(indexMessageEntry));

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
