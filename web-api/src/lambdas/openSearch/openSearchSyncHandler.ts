import { SQSEvent } from 'aws-lambda';
import {
  OpenSearchSyncMessage,
  openSearchSyncRouter,
} from '@web-api/gateways/openSearch/openSearchSyncRouter';

export const openSearchSyncHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: OpenSearchSyncMessage = JSON.parse(body);
  await openSearchSyncRouter({ message });
};
