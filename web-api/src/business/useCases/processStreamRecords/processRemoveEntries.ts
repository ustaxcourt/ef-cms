import { ServerApplicationContext } from '@web-api/applicationContext';
import { DynamoDBRecord } from 'aws-lambda';

export const processRemoveEntries = async ({
  applicationContext,
  removeRecords,
}: {
  applicationContext: ServerApplicationContext;
  removeRecords: DynamoDBRecord[];
}) => {
  if (!removeRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${removeRecords.length} removeRecords`,
  );

  // When purging Dynamo data after it has been migrated to Postgres, we do not
  // want to remove the data from the OpenSearch index.
  const recordsToDelete = removeRecords.filter(record => {
    const entityName = record?.dynamodb?.NewImage?.entityName?.S;
    const ignoreEntities: (string | undefined)[] = ['DocketEntry', 'Case'];
    if (ignoreEntities.includes(entityName)) {
      return false;
    }
    return true;
  });

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkDeleteRecords({
      applicationContext,
      records: recordsToDelete,
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to delete', {
      failedRecords,
    });
    throw new Error('failed to delete records');
  }
};
