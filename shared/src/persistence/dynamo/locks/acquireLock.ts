import { FORMATS, formatNow } from '../../../business/utilities/DateHandler';
import { getTableName } from '../../dynamodbClientService';

/**
 * tries to createLock a lock from a dynamodb table
 */
export async function createLock({
  applicationContext,
  identifier,
  ttl = 30,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  ttl?: number;
}) {
  const now = formatNow();
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));

  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .put({
      Item: {
        pk: identifier,
        sk: 'lock',
        timestamp: now,
        ttl: ttl + nowUnix,
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
}: {
  applicationContext: IApplicationContext;
  identifier: string;
}) {
  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .delete({
      Key: {
        pk: identifier,
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
}: {
  applicationContext: IApplicationContext;
  identifier: string;
}) {
  const now = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const res = await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .get({
      ConsistentRead: true,
      Key: {
        pk: identifier,
        sk: 'lock',
      },
      TableName: getTableName({
        applicationContext,
      }),
      applicationContext,
    })
    .promise();

  if (!res?.Item || res.Item.ttl < now) {
    return undefined;
  }
  return res.Item;
}
