import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { queryFull } from '../../dynamodbClientService';

export const getCaseWorksheets = async (
  applicationContext: IApplicationContext,
  {
    judgeId,
  }: {
    judgeId: string;
  },
): Promise<TDynamoRecord[]> => {
  const caseWorksheets = await queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `judge-case-worksheet|${judgeId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  return caseWorksheets;
};
