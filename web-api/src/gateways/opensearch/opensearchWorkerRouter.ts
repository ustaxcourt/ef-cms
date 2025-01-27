import { updateCaseWorker } from '@web-api/lambdas/opensearch/updateCaseWorker';

export const TABLES_TO_INDEX_IN_OPENSEARCH = ['dwCase', 'dwDocketEntry'];

export type OpensearchWorkerMessage = {
  payload: any;
  type: WorkerMessageType;
  timestamp: string;
};

export type WorkerMessageType =
  (typeof TABLES_TO_INDEX_IN_OPENSEARCH)[keyof typeof TABLES_TO_INDEX_IN_OPENSEARCH];

export type WorkerHandler = ({
  message,
}: {
  message: OpensearchWorkerMessage;
}) => Promise<void>;

export const workerRouter = async ({
  message,
}: {
  message: OpensearchWorkerMessage;
}): Promise<void> => {
  switch (message.type) {
    case TABLES_TO_INDEX_IN_OPENSEARCH[0]:
      await updateCaseWorker({ message });
      break;
    default:
      throw new Error(
        `No matching router found for message: ${JSON.stringify(message)}`,
      );
  }
};
