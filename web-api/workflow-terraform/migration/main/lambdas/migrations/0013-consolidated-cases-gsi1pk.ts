import {
  CaseRecord,
  TDynamoRecord,
} from '../../../../../src/persistence/dynamo/dynamoTypes';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  isCaseItem,
  isIrsPractitionerItem,
  isPrivatePractitionerItem,
} from '../../../../../src/persistence/dynamo/helpers/aggregateCaseItems';
export const migrateItems = async (
  items: TDynamoRecord[],
  documentClient: DocumentClient,
): Promise<TDynamoRecord[]> => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (isCaseItem(item) && item.leadDocketNumber) {
      item.gsi1pk = `leadCase|${item.leadDocketNumber}`;
    }
    if (isPrivatePractitionerItem(item) || isIrsPractitionerItem(item)) {
      const docketNumber = item.pk.slice(5);
      console.log('docketNumber', docketNumber);
      const result = await documentClient
        .get({
          Key: {
            pk: `case|${docketNumber}`,
            sk: `case|${docketNumber}`,
          },
          TableName: process.env.SOURCE_TABLE!,
        })
        .promise();
      const caseRecord = result.Item! as CaseRecord;

      if (caseRecord.leadDocketNumber) {
        item.gsi1pk = `leadCase|${caseRecord.leadDocketNumber}`;
      }
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};
