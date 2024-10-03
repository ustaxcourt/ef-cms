import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import {
  WorkerHandler,
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const workerLocal: WorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { message }: { message: WorkerMessage },
): Promise<void> => {
  // Simulate what happens on a deployed environment when a message is sent to SQS.
  const appContext = createApplicationContext();
  getLogger().addUser({ user: message.authorizedUser });
  setTimeout(
    async () => {
      try {
        await workerRouter(appContext, { message });
      } catch (error) {
        console.error('Worker Local Error: ', error);
      }
    },
    Math.random() * 1000 * 3,
  );
  return;
};
