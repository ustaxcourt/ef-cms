import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  WorkerHandler,
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';

export const workerLocal: WorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  // Simulate what happens on a deployed environment when a message is sent to SQS.
  setTimeout(
    async () => {
      try {
        await workerRouter(applicationContext, { message });
      } catch (error) {
        console.error('Worker Local Error: ', error);
      }
    },
    Math.random() * 1000 * 3,
  );
  return;
};
