import { RawMessage } from '@shared/business/entities/Message';
import { getLogger } from 'aws-xray-sdk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';

export const processMessageEntries = async ({
  messageRecords,
}: {
  messageRecords: any[];
}) => {
  if (!messageRecords.length) return;

  getLogger().debug(`going to index ${messageRecords.length} message records`);

  await upsertMessages(
    messageRecords.map(messageRecord => {
      return unmarshall(messageRecord.dynamodb.NewImage) as RawMessage;
    }),
  );
};
