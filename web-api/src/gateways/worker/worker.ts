import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  WorkerHandler,
  WorkerMessage,
} from '@web-api/gateways/worker/workerRouter';

export const worker: WorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  const sqs = await applicationContext.getMessagingClient();
  await sqs
    .sendMessage({
      MessageBody: JSON.stringify(message),
      QueueUrl: applicationContext.environment.workerQueueUrl,
    })
    .promise();
};
