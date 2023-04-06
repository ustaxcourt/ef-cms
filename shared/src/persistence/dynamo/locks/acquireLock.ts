import { FORMATS, formatNow } from '../../../business/utilities/DateHandler';
import { getTableName } from '../../dynamodbClientService';

/**
 * tries to createLock a lock from a dynamodb table
 */
export async function createLock({
  applicationContext,
  identifier,
  prefix,
  ttl = 30,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  prefix: string;
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
        pk: `${prefix}|${identifier}`,
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
    .get({
      ConsistentRead: true,
      Key: {
        pk: `${prefix}|${identifier}`,
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
