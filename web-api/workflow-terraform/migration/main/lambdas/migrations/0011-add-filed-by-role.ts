import { TDynamoRecord } from '../../../../../../shared/src/persistence/dynamo/dynamoTypes';
import { createApplicationContext } from '../../../../../src/applicationContext';

const applicationContext = createApplicationContext({});

const isDocketEntryItem = item => {
  return (
    item.pk.startsWith('docket-entry|') && item.sk.startsWith('docket-entry|')
  );
};

export const migrateItems = async items => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isDocketEntryItem(item)) {
      const filedByUser = await applicationContext
        .getPersistenceGateway()
        .getUserById({
          applicationContext,
          userId: item.userId,
        });

      item.filedByRole = filedByUser ? filedByUser.role : 'System';
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};
