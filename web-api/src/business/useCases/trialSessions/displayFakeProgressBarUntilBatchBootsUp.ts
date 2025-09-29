import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function displayFakeProgressBarUntilBatchBootsUp(
  applicationContext: ServerApplicationContext,
  clientConnectionId: string,
  authorizedUser: AuthUser,
) {
  const FAKE_NUMBER = 45;
  for (let index = 0; index < FAKE_NUMBER; index++) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'aws_batch_download_progress',
        filesCompleted: index,
        totalFiles: FAKE_NUMBER,
      },
      userId: authorizedUser.userId,
    });
    await new Promise(resolve => setTimeout(() => resolve(null), 1000));
  }
}
