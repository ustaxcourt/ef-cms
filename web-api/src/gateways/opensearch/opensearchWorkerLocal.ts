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
  // Simulate what happens on a deployed environment when a message is sent to SQS.
  // setTimeout(
  //   async () => {
  //     try {
  //       console.log('call workerRouter');
  //       await workerRouter({ message });
  //     } catch (error) {
  //       console.error('Worker Local Error: ', error);
  //     }
  //   },
  //   Math.random() * 1000 * 3,
  // );
  // return;
  try {
    console.log('call workerRouter');
    await workerRouter({ message });
  } catch (error) {
    console.error('Worker Local Error: ', error);
  }
};
