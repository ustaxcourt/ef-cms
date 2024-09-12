import { RawMessage } from '@shared/business/entities/Message';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';
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

  await upsertMessages(
    messageRecords.map(messageRecord => {
      return unmarshall(messageRecord.dynamodb.NewImage) as RawMessage;
    }),
  );
};
