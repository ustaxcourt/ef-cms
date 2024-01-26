import { ServerApplicationContext } from '@web-api/applicationContext';

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

export type WorkerHandler = (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
) => Promise<void>;

export const workerRouter = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  switch (message.type) {
    case MESSAGE_TYPES.UPDATE_PETITIONER_CASES:
      await applicationContext
        .getUseCases()
        .updatePetitionerCasesInteractor(applicationContext, message.payload);
      break;
    case MESSAGE_TYPES.UPDATE_PENDING_EMAIL:
      await applicationContext
        .getUseCases()
        .setUserEmailFromPendingEmailInteractor(
          applicationContext,
          message.payload,
        );
      break;
    default:
      throw new Error(
        `No matching router found for message: ${JSON.stringify(message)}`,
      );
  }
};
