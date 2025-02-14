import { opensearchCaseSync } from '@web-api/lambdas/opensearch/updateCaseSync';

export const TABLES_TO_OPENSEARCH_MAPPING = {
  dwCase: opensearchCaseSync,
};

export type OpensearchSyncMessage = {
  payload: any;
  type: SyncMessageType;
  timestamp: string;
};

export type SyncMessageType = keyof typeof TABLES_TO_OPENSEARCH_MAPPING;

export type SyncHandler = ({
  message,
}: {
  message: OpensearchSyncMessage;
}) => Promise<void>;

export const syncRouter = async ({
  message,
}: {
  message: OpensearchSyncMessage;
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
