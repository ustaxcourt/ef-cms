import {
  WorkerHandler,
  OpensearchWorkerMessage,
  workerRouter,
} from '@web-api/gateways/opensearch/opensearchWorkerRouter';

export const workerLocal: WorkerHandler = async ({
  message,
}: {
  message: OpensearchWorkerMessage;
}): Promise<void> => {
  try {
    await workerRouter({ message });
  } catch (error) {
    console.error('Worker Local Error: ', error);
  }
};
