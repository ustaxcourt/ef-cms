import { SYSTEM_ROLE } from '../../../../../../shared/src/business/entities/EntityConstants';
import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';
import { getUserById } from '../utilities/getUserById';

const isDocketEntryItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

export const migrateItems = async (items, documentClient) => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isDocketEntryItem(item) && !item.isDraft) {
      const { Item } = (await getUserById(documentClient, item.userId)) as any;

      console.log('*** filedByUser is: ', Item, item.eventCode);

      if (Item && !Item.role) {
        console.log('*** no role found: ', Item);
      }

      item.filedByRole = Item ? Item.role : SYSTEM_ROLE;
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
