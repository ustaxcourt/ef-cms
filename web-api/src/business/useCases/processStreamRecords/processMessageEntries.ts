import { RawMessage } from '@shared/business/entities/Message';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertMessage } from '@web-api/persistence/postgres/messages/upsertMessage';
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

  await Promise.all(
    messageRecords.map(async messageRecord => {
      const messageNewImage = messageRecord.dynamodb.NewImage;
      const rawMessage = unmarshall(messageNewImage) as RawMessage;
      await upsertMessage(rawMessage);
    }),
  );
};
