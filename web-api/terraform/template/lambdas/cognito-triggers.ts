import { SQSEvent } from 'aws-lambda';
import { createApplicationContext } from '../../../src/applicationContext';

export type WorkerMessage = {
  payload: any;
  type: WorkerMessageType;
};

export const MESSAGE_TYPES = {
  UPDATE_PENDING_EMAIL: 'UPDATE_PENDING_EMAIL',
  UPDATE_PETITIONER_CASES: 'UPDATE_PETITIONER_CASES',
} as const;
const WORKER_MESSAGE_TYPES = Object.values(MESSAGE_TYPES);
export type WorkerMessageType = (typeof WORKER_MESSAGE_TYPES)[number];

export const updatePetitionerCasesLambda = async (event: SQSEvent) => {
  const applicationContext = createApplicationContext({});

  const { Records } = event;
  const { body } = Records[0];
  const messageBody: WorkerMessage = JSON.parse(body);
  applicationContext.logger.info('updatePetitionerCasesLambda', event);

  switch (messageBody.type) {
    case MESSAGE_TYPES.UPDATE_PETITIONER_CASES:
      await applicationContext.getUseCases().updatePetitionerCasesInteractor({
        applicationContext,
        user: messageBody.payload,
      });
      break;
    case MESSAGE_TYPES.UPDATE_PENDING_EMAIL:
      await applicationContext
        .getUseCases()
        .setUserEmailFromPendingEmailInteractor(applicationContext, {
          user: messageBody.payload,
        });
      break;
    default:
      console.log('No matching case found for message: ', messageBody);
  }
};
