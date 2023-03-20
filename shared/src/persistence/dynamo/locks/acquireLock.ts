import { getTableName } from '../../dynamodbClientService';

/**
 * tries to acquire a lock from a dynamodb table
 */
export async function acquireLock({
  applicationContext,
  lockName,
}: {
  applicationContext: IApplicationContext;
  lockName: string;
}) {
  const lockTtl = 10000;

  const { Item: lock } = await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .get({
      Key: {
        pk: `lock-${lockName}`,
        sk: `lock-${lockName}`,
      },
      TableName: getTableName({
        applicationContext,
      }),
    })
    .promise();

  if (lock.ttl <= Date.now()) {
    await deleteLock({ applicationContext, lockName });
  }

  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .put({
      ConditionExpression: 'attribute_not_exists(lockName)',
      Item: {
        gsi1pk: 'lock',
        lockName: `lock-${lockName}`,
        pk: `lock-${lockName}`,
        sk: `lock-${lockName}`,
        ttl: Date.now() + lockTtl,
      },
      TableName: getTableName({
        applicationContext,
      }),
    })
    .promise();
}

/**
 *
 */
export async function deleteLock({
  applicationContext,
  lockName,
}: {
  applicationContext: IApplicationContext;
  lockName: string;
}) {
  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .delete({
      Key: {
        pk: `lock-${lockName}`,
        sk: `lock-${lockName}`,
      },
      TableName: getTableName({
        applicationContext,
      }),
    })
    .promise();
}
