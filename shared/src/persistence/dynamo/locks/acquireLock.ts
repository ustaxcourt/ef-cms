import { FORMATS, formatNow } from '../../../business/utilities/DateHandler';
import { User } from '../../../business/entities/User';
import { getTableName } from '../../dynamodbClientService';

/**
 * tries to acquire a lock from a dynamodb table
 */
export async function acquireLock({
  applicationContext,
  lockId,
  lockName,
  user,
}: {
  applicationContext: IApplicationContext;
  lockId: string;
  lockName: string;
  user: User;
}) {
  const now = formatNow();
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));

  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .put({
      Item: {
        pk: lockName,
        sk: `lock|${lockId}`,
        timestamp: now,
        ttl: nowUnix + 30,
        user,
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
  lockId,
  lockName,
}: {
  applicationContext: IApplicationContext;
  lockName: string;
  lockId: string;
}) {
  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .delete({
      Key: {
        pk: lockName,
        sk: `lock|${lockId}`,
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
  lockName,
}: {
  applicationContext: IApplicationContext;
  lockName: string;
}) {
  const now = formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS);
  const res = await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .queryFull({
      ConsistentRead: true,
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
        '#ttl': 'ttl',
      },
      ExpressionAttributeValues: {
        ':now': now,
        ':pk': lockName,
        ':prefix': 'lock|',
      },
      FilterExpression: '#ttl > :now',
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: getTableName({
        applicationContext,
      }),
      applicationContext,
    })
    .promise();
  return res[0];
}
