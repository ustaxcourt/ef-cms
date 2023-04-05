import { FORMATS, formatNow } from '../../../business/utilities/DateHandler';
import { getTableName } from '../../dynamodbClientService';

/**
 * will wrap a function with logic to acquire a lock and delete a lock after finishing.
 *
 * @param {function} cb the original function to wrap
 * @param {function} getLockInfo a function which is passes the original args for getting the lock suffix
 * @param {error} onLockError the error object to throw if a lock is already in use
 * @returns {object} the item that was retrieved
 */
export function withLocking(
  cb: (applicationContext: IApplicationContext, options: any) => any,
  getLockInfo,
  onLockError,
) {
  return async function (
    applicationContext: IApplicationContext,
    options: any,
  ) {
    const { identifier, prefix } = getLockInfo(options);

    const currentLock = await getLock({
      applicationContext,
      identifier,
      prefix,
    });

    if (currentLock) {
      throw onLockError;
    }

    await acquireLock({ applicationContext, identifier, prefix });

    const results = await cb(applicationContext, options);

    await applicationContext
      .getPersistenceGateway()
      .removeLock({ applicationContext, identifier, prefix });

    return results;
  };
}

/**
 * tries to acquire a lock from a dynamodb table
 */
export async function acquireLock({
  applicationContext,
  identifier,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  prefix: string;
}) {
  const now = formatNow();
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const ttl = nowUnix + 30;

  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .put({
      Item: {
        pk: `${prefix}|${identifier}`,
        sk: 'lock',
        timestamp: now,
        ttl,
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
export async function removeLock({
  applicationContext,
  identifier,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  prefix: string;
}) {
  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .delete({
      Key: {
        pk: `${prefix}|${identifier}`,
        sk: 'lock',
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
export async function getLock({
  applicationContext,
  identifier,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  prefix: string;
}) {
  const now = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const res = await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .query({
      ConsistentRead: true,
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
        '#ttl': 'ttl',
      },
      ExpressionAttributeValues: {
        ':now': now,
        ':pk': `${prefix}|${identifier}`,
        ':sk': 'lock',
      },
      FilterExpression: '#ttl > :now',
      KeyConditionExpression: '#pk = :pk and #sk = :sk',
      TableName: getTableName({
        applicationContext,
      }),
      applicationContext,
    })
    .promise();
  return res.Items[0];
}
