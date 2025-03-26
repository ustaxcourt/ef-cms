import {
  OpenSearchSyncHandler,
  OpenSearchSyncMessage,
  openSearchSyncRouter,
} from '@web-api/gateways/openSearch/openSearchSyncRouter';

export const openSearchSyncLocal: OpenSearchSyncHandler = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  try {
    await openSearchSyncRouter({ message });
  } catch (error) {
    console.error('Sync Local Error: ', error);
  }
};
