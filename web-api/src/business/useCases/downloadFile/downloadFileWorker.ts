import { ServerApplicationContext } from '@web-api/applicationContext';

export const downloadFileWorker = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    url,
    userId,
  }: { url: string; clientConnectionId: string; userId: string },
): Promise<void> => {
  const message = {
    applicationContext,
    clientConnectionId,
    message: {
      action: 'batch_download_ready',
      url,
    },
    userId,
  };

  await applicationContext
    .getNotificationGateway()
    .sendNotificationToUser(message);
};
