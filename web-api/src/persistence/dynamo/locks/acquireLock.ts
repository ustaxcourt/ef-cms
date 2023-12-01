import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { TDynamoRecord } from '../dynamoTypes';
import { getTableName } from '../../dynamodbClientService';

export type TLockDynamoRecord = TDynamoRecord & { timestamp: string };

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
}): Promise<void> {
  const now = formatNow();
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const item: TLockDynamoRecord = {
    pk: identifier,
    sk: 'lock',
    timestamp: now,
    ttl: ttl + nowUnix,
  };

  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .put({
      Item: item,
      TableName: getTableName({
        applicationContext,
      }),
    });
}

/**
 *
 */
export async function removeLock({
  applicationContext,
  identifiers,
}: {
  applicationContext: IApplicationContext;
  identifiers: string[];
}): Promise<void> {
  await Promise.all(
    identifiers.map(identifierToUnlock =>
      applicationContext
        .getDocumentClient({
          useMasterRegion: true,
        })
        .delete({
          Key: {
            pk: identifierToUnlock,
            sk: 'lock',
          },
          TableName: getTableName({
            applicationContext,
          }),
        }),
    ),
  );
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
}): Promise<undefined | TLockDynamoRecord> {
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
    });

  if (!res?.Item || res.Item.ttl < now) {
    return undefined;
  }
  return res.Item;
}
