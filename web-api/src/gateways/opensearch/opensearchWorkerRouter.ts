import { opensearchUpdateCaseWorker } from '@web-api/lambdas/opensearch/updateCaseWorker';

export const TABLES_TO_OPENSEARCH_MAPPING = {
  dwCase: opensearchUpdateCaseWorker,
};

export type OpensearchWorkerMessage = {
  payload: any;
  type: WorkerMessageType;
  timestamp: string;
};

export type WorkerMessageType = keyof typeof TABLES_TO_OPENSEARCH_MAPPING;

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
  const routerFn = TABLES_TO_OPENSEARCH_MAPPING[message.type];
  console.log('message.type', message.type);
  if (!routerFn) {
    throw new Error(
      `No matching router found for message: ${JSON.stringify(message)}`,
    );
  }
  await routerFn({ message });
};
