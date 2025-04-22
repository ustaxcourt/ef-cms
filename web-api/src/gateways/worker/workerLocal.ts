import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  WorkerHandler,
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const workerLocal: WorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
// eslint-disable-next-line @typescript-eslint/require-await
): Promise<void> => {
  // Simulate what happens on a deployed environment when a message is sent to SQS.
  getLogger().addUser({ user: message.authorizedUser });
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
