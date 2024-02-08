import { SQSEvent } from 'aws-lambda';
import {
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { createApplicationContext } from '@web-api/applicationContext';

export const workerHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: WorkerMessage = JSON.parse(body);
  const applicationContext = createApplicationContext(message.user);
  await workerRouter(applicationContext, { message });
};
