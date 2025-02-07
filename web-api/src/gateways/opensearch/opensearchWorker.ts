import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { environment } from '@web-api/environment';
import {
  WorkerHandler,
  OpensearchWorkerMessage,
} from '@web-api/gateways/opensearch/opensearchWorkerRouter';

let sqsCache: SQSClient;

export const worker: WorkerHandler = async ({
  message,
}: {
  message: OpensearchWorkerMessage;
}): Promise<void> => {
  const sqs: SQSClient = getMessagingClient();
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
