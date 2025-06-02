import { DatabaseSchema } from '@web-api/database-schema';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';

export const openSearchSyncLocal = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  try {
    const handlerFn = DatabaseSchema[message.type].indexOpenSearchMessage;
    if (!handlerFn) {
      throw new Error(
        `No matching router found for message: ${JSON.stringify(message)}`,
      );
    }
    await handlerFn({ message });
  } catch (error) {
    console.error('Sync Local Error: ', error);
  }
};
