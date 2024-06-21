import { PublishCommand } from '@aws-sdk/client-sns';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const sendNotificationOfSealing = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
): Promise<void> => {
  const params = {
    Message: JSON.stringify({ docketEntryId, docketNumber }),
    TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:seal_notifier`,
  };

  const maxRetries = 5;

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    const publishCommand = new PublishCommand(params);
    try {
      const response = await applicationContext
        .getNotificationService()
        .send(publishCommand);
      applicationContext.logger.info('sent notification of sealing', {
        docketEntryId,
        docketNumber,
        response,
      });
      return;
    } catch (err) {
      applicationContext.logger.error('error attempting to send notification', {
        err,
        retryCount,
      });
    }
  }

  applicationContext.logger.error(
    'complete failure attempting to send notification of sealing an item',
  );
};
