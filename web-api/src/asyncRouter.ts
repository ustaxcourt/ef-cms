import { ServerApplicationContext } from '@web-api/applicationContext';

export type AsyncMessage = {
  payload: any;
  type: AsyncMessageType;
  user: {
    role: string;
    userId: string;
    name: string;
  };
};

export const ASYNC_MESSAGE_TYPES = {
  BATCH_DOWNLOAD_TRIAL_SESSION: 'BATCH_DOWNLOAD_TRIAL_SESSION',
} as const;
export type AsyncMessageType =
  (typeof ASYNC_MESSAGE_TYPES)[keyof typeof ASYNC_MESSAGE_TYPES];

export type AsyncHandler = (
  applicationContext: ServerApplicationContext,
  { message }: { message: AsyncMessage },
) => Promise<void>;

export const asyncRouter = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: AsyncMessage },
): Promise<void> => {
  switch (message.type) {
    case ASYNC_MESSAGE_TYPES.BATCH_DOWNLOAD_TRIAL_SESSION:
      await applicationContext
        .getUseCases()
        .batchDownloadTrialSessionInteractor(
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
