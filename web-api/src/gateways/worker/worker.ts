import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  WorkerHandler,
  WorkerMessage,
} from '@web-api/gateways/worker/workerRouter';

export const worker: WorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  const sqs: SQSClient = await applicationContext.getMessagingClient();
  const cmd = new SendMessageCommand({
    MessageBody: JSON.stringify(message),
    QueueUrl: applicationContext.environment.workerQueueUrl,
  });
  await sqs.send(cmd);
};
