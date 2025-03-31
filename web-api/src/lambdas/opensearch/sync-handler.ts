import { SQSEvent } from 'aws-lambda';
import {
  OpensearchSyncMessage,
  syncRouter,
} from '@web-api/gateways/opensearch/opensearchSyncRouter';

export const syncHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: OpensearchSyncMessage = JSON.parse(body);
  await syncRouter({ message });
};
