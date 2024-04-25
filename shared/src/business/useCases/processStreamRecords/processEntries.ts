import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processEntries = async ({
  applicationContext,
  records,
  recordType,
}: {
  applicationContext: ServerApplicationContext;
  records: any[];
  recordType: string;
}) => {
  if (!records.length) return;

  applicationContext.logger.debug(
    `going to index ${records.length} ${recordType}`,
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records,
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to index', {
      failedRecords,
    });
    throw new Error('failed to index records');
  }
};
