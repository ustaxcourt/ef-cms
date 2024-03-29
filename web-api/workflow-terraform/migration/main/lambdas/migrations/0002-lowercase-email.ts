import { RawUser } from '@shared/business/entities/User';
import type { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

const isUserRecord = item => {
  return item.pk.startsWith('user|') && item.sk.startsWith('user|');
};

const isRecordToUpdate = item => {
  return isUserRecord(item);
};

export const migrateItems = (items: TDynamoRecord[]) => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isRecordToUpdate(item)) {
      const rawUser = item as unknown as RawUser;

      rawUser.email = rawUser.email
        ? rawUser.email.toLowerCase()
        : rawUser.email;
      rawUser.pendingEmail = rawUser.pendingEmail
        ? rawUser.pendingEmail.toLowerCase()
        : rawUser.pendingEmail;
    }
    itemsAfter.push(item);
  }

  return itemsAfter;
};
