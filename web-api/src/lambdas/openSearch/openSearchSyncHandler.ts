import { SQSEvent } from 'aws-lambda';
import { DatabaseSchema } from '@web-api/persistence/postgres/database-schema';

export type OpenSearchSyncMessageType = keyof typeof DatabaseSchema;
export type OpenSearchSyncAction =
  (typeof OPENSEARCH_SYNC_ACTIONS)[keyof typeof OPENSEARCH_SYNC_ACTIONS];

export const OPENSEARCH_SYNC_ACTIONS = {
  UPSERT: 'UPSERT',
  DELETE: 'DELETE',
} as const;

export type OpenSearchSyncMessage = {
  payload: any;
  type: OpenSearchSyncMessageType;
  timestamp: string;
  action: OpenSearchSyncAction;
};

export const openSearchSyncHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: OpenSearchSyncMessage = JSON.parse(body);

  const handlerFn = DatabaseSchema[message.type].indexOpenSearchMessage;
  if (!handlerFn) {
    throw new Error(
      `No matching handler found for message: ${JSON.stringify(message)}`,
    );
  }
  await handlerFn({ message });
};
