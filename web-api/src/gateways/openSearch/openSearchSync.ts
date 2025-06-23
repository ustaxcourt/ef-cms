import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { environment } from '@web-api/environment';
import { getMessagingClient } from '@web-api/gateways/message/getMessagingClient';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';

export const openSearchSync = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const sqs = getMessagingClient();

  const cmd = new SendMessageCommand({
    MessageBody: JSON.stringify(message),
    QueueUrl: environment.opensearchQueueUrl,
  });

  await sqs.send(cmd);
};
