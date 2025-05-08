import { SQSEvent } from 'aws-lambda';
import {
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { applicationContext } from '@web-api/applicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getLogger';

export const workerHandler = async (event: SQSEvent): Promise<void> => {
  const { Records } = event;
  const { body } = Records[0];
  const message: WorkerMessage = JSON.parse(body);
  getDawsonLogger().addUser({ user: message.authorizedUser });
  await workerRouter(applicationContext, { message });
};
