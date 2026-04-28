import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import {
  type WorkerHandler,
  type WorkerMessage,
} from '@web-api/gateways/worker/workerRouter';

export const worker: WorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  const delay = message.delay ?? 0;
  const sqs: SQSClient = await applicationContext.getMessagingClient();
  const cmd = new SendMessageCommand({
    DelaySeconds: delay,
    MessageBody: JSON.stringify(message),
    QueueUrl: applicationContext.environment.workerQueueUrl,
  });
  await sqs.send(cmd);
};
