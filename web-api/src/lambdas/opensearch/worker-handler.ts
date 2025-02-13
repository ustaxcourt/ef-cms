import { SQSEvent } from 'aws-lambda';
import {
  OpensearchWorkerMessage,
  workerRouter,
} from '@web-api/gateways/opensearch/opensearchWorkerRouter';

export const workerHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: OpensearchWorkerMessage = JSON.parse(body);
  await workerRouter({ message });
};
