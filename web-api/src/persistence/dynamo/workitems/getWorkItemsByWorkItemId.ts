import { query } from '../../dynamodbClientService';

export const getWorkItemsByWorkItemId = ({
  applicationContext,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  workItemId: string;
}) =>
  query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `work-item|${workItemId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
