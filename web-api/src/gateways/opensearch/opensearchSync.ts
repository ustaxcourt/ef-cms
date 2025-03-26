import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { environment } from '@web-api/environment';
import {
  OpenSearchSyncHandler,
  OpenSearchSyncMessage,
} from '@web-api/gateways/openSearch/openSearchSyncRouter';

let sqsCache: SQSClient;

export const openSearchSync: OpenSearchSyncHandler = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const sqs: SQSClient = getMessagingClient();

  // TODO 10502
  // if (message.type === 'dwCase') {
  //   message.payload = indexCaseEntity({ message.payload });
  // }

  const cmd = new SendMessageCommand({
    MessageBody: JSON.stringify(message),
    QueueUrl: environment.opensearchQueueUrl,
  });

  await sqs.send(cmd);
};

const getMessagingClient = () => {
  if (!sqsCache) {
    sqsCache = new SQSClient({
      maxAttempts: 3,
      region: environment.region,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        requestTimeout: 5000,
      }),
    });
  }
  return sqsCache;
};
