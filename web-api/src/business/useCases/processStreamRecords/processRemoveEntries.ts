import { ServerApplicationContext } from '@web-api/applicationContext';

export const processRemoveEntries = async ({
  applicationContext,
  removeRecords,
}: {
  applicationContext: ServerApplicationContext;
  removeRecords: any[];
}) => {
  if (!removeRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${removeRecords.length} removeRecords`,
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkDeleteRecords({
      applicationContext,
      records: removeRecords,
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to delete', {
      failedRecords,
    });
    throw new Error('failed to delete records');
  }
};
