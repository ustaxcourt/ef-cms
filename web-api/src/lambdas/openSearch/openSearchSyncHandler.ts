import { SQSEvent } from 'aws-lambda';
import { DatabaseSchema } from '@web-api/database-types';

export type OpenSearchSyncMessageType = keyof typeof DatabaseSchema;

export type OpenSearchSyncMessage = {
  payload: any;
  type: OpenSearchSyncMessageType;
  timestamp: string;
};

export const openSearchSyncHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: OpenSearchSyncMessage = JSON.parse(body);

  const handlerFn = DatabaseSchema[message.type].indexOpenSearchMessage;
  if (!handlerFn) {
    throw new Error(
      `No matching router found for message: ${JSON.stringify(message)}`,
    );
  }
  await handlerFn({ message });
};
