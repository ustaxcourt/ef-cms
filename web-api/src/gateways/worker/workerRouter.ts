import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ServerApplicationContext } from '@web-api/applicationContext';

export type WorkerMessage = {
  payload: any;
  type: WorkerMessageType;
  authorizedUser: AuthUser;
};

export const MESSAGE_TYPES = {
  QUEUE_UPDATE_ASSOCIATED_CASES: 'QUEUE_UPDATE_ASSOCIATED_CASES',
  UPDATE_ASSOCIATED_CASE: 'UPDATE_ASSOCIATED_CASE',
} as const;
export type WorkerMessageType =
  (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export type WorkerHandler = (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
) => Promise<void>;

export const workerRouter = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  switch (message.type) {
    case MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE:
      await applicationContext
        .getUseCases()
        .updateAssociatedCaseWorker(
          applicationContext,
          message.payload,
          message.authorizedUser,
        );
      break;
    case MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES:
      await applicationContext
        .getUseCases()
        .queueUpdateAssociatedCasesWorker(
          applicationContext,
          message.payload,
          message.authorizedUser,
        );
      break;
    default:
      throw new Error(
        `No matching router found for message: ${JSON.stringify(message)}`,
      );
  }
};
