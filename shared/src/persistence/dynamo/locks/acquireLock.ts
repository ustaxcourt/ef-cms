import { getTableName } from '../../dynamodbClientService';

/**
 * will wrap a function with logic to acquire a lock and delete a lock after finishing.
 *
 * @param {function} cb the original function to wrap
 * @param {function} getLockName a function which is passes the original args for getting the lock suffix
 * @param {error} onLockError the error object to throw if a lock is already in use
 * @returns {object} the item that was retrieved
 */
export function withLocking(
  cb: (applicationContext: IApplicationContext, options: any) => any,
  getLockName,
  onLockError,
) {
  return async function (
    applicationContext: IApplicationContext,
    options: any,
  ) {
    const lockName = getLockName(options);

    let results;
    try {
      await applicationContext
        .getPersistenceGateway()
        .acquireLock({ applicationContext, lockName })
        .catch(err => {
          if (err.code === 'ConditionalCheckFailedException') {
            throw onLockError;
          } else {
            throw err;
          }
        });
      results = await cb(applicationContext, options);
    } catch (error) {
      if (error.code !== 'ConditionalCheckFailedException') {
        await applicationContext
          .getPersistenceGateway()
          .deleteLock({ applicationContext, lockName });
      }
      throw error;
    }
    return results;
  };
}
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

  if (lock && lock.ttl <= Date.now()) {
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
