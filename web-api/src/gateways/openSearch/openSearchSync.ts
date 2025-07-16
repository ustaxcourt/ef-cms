import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { applicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';

export const openSearchSync = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const sqs: SQSClient = applicationContext.getMessagingClient();

  const cmd = new SendMessageCommand({
    MessageBody: JSON.stringify(message),
    QueueUrl: environment.opensearchQueueUrl,
  });

  await sqs.send(cmd);
};
