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
      // we are explicitly catching this upsert to prevent the entire
      // streams from getting blocked in case there is an issue connecting to
      // rds.  For right now, we don't think the functionality of getting the message
      // metadata over to RDS warrants blocking the entire stream.
      await upsertMessage(rawMessage).catch(console.error);
    }),
  );
};
