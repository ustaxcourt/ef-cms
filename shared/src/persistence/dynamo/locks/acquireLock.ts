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
  let lockAcquired = false;

  while (!lockAcquired) {
    try {
      await applicationContext
        .getDocumentClient({
          useMasterRegion: true,
        })
        .put({
          ConditionExpression: 'attribute_not_exists(lockName)',
          Item: {
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

      lockAcquired = true;
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        // lock entry exists, check the TTL
        // const lock = await applicationContext
        //   .getDocumentClient({
        //     useMasterRegion: true,
        //   })
        //   .get({
        //     ConditionExpression: 'attribute_not_exists(lockName)',
        //     Key: {
        //       pk: `lock-${lockName}`,
        //       sk: `lock-${lockName}`,
        //     },
        //     TableName: getTableName({
        //       applicationContext,
        //     }),
        //   })
        //   .promise();

        // if (lock.Item.ttl <= Date.now()) {
        //   await deleteLock({ applicationContext, lockName });
        // } else {
        //   await new Promise(resolve => setTimeout(resolve, lockWaitTime));
        // }
        throw error;
      } else {
        throw error;
      }
    }
  }
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
