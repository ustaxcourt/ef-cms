import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { get } from '../../dynamodbClientService';

export const getCaseWorksheet = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<TDynamoRecord> => {
  return await get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `case-worksheet|${docketNumber}`,
    },
    applicationContext,
  });
};
