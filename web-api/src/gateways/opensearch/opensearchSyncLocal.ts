import {
  SyncHandler,
  OpensearchSyncMessage,
  syncRouter,
} from '@web-api/gateways/opensearch/opensearchSyncRouter';

export const syncLocal: SyncHandler = async ({
  message,
}: {
  message: OpensearchSyncMessage;
}): Promise<void> => {
  try {
    await syncRouter({ message });
  } catch (error) {
    console.error('Sync Local Error: ', error);
  }
};
