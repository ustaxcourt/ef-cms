import { SQSEvent } from 'aws-lambda';
import {
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { createApplicationContext } from '../../../src/applicationContext';

//TODO Rename file and/or function?
export const updatePetitionerCasesLambda = async (event: SQSEvent) => {
  const applicationContext = createApplicationContext({});

  const { Records } = event;
  const { body } = Records[0];
  const message: WorkerMessage = JSON.parse(body);

  await workerRouter(applicationContext, { message });
};
