import { openSearchCaseSync } from '@web-api/lambdas/openSearch/openSearchCaseSync';

export const TABLES_TO_OPENSEARCH_MAPPING = {
  dwCase: openSearchCaseSync,
};

export type OpenSearchSyncMessage = {
  payload: any;
  type: OpenSearchSyncMessageType;
  timestamp: string;
};

export type OpenSearchSyncMessageType =
  keyof typeof TABLES_TO_OPENSEARCH_MAPPING;

export type OpenSearchSyncHandler = ({
  message,
}: {
  message: OpenSearchSyncMessage;
}) => Promise<void>;

export const openSearchSyncRouter = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const routerFn = TABLES_TO_OPENSEARCH_MAPPING[message.type];
  if (!routerFn) {
    throw new Error(
      `No matching router found for message: ${JSON.stringify(message)}`,
    );
  }
  await routerFn({ message });
};
