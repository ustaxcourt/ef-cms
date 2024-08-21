import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TDynamoRecord } from '../dynamoTypes';
import { batchDelete, getTableName } from '../../dynamodbClientService';

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
    .getDocumentClient(applicationContext, {
      useMainRegion: true,
    })
    .put({
      Item: item,
      TableName: getTableName({
        applicationContext,
      }),
    });
}

export async function removeLock({
  applicationContext,
  identifiers,
}: {
  applicationContext: ServerApplicationContext;
  identifiers: string[];
}): Promise<void> {
  const items = identifiers.map(id => ({ pk: id, sk: 'lock' }));
  await batchDelete({ applicationContext, items });
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
    .getDocumentClient(applicationContext, {
      useMainRegion: true,
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
