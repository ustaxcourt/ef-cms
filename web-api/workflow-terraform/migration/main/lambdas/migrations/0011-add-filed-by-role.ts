import { SYSTEM_ROLE } from '../../../../../../shared/src/business/entities/EntityConstants';
import { TDynamoRecord } from '../../../../../../shared/src/persistence/dynamo/dynamoTypes';
import { createApplicationContext } from '../../../../../src/applicationContext';

const applicationContext = createApplicationContext({});

const isDocketEntryItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

export const migrateItems = async items => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isDocketEntryItem(item) && !item.isDraft) {
      const filedByUser = await applicationContext
        .getPersistenceGateway()
        .getUserById({
          applicationContext,
          userId: item.userId,
        });

      item.filedByRole = filedByUser ? filedByUser.role : SYSTEM_ROLE;
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
