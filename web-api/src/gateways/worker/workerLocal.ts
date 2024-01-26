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
  await workerRouter(applicationContext, { message });
};
