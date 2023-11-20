import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

export const getDocketNumberForWorkItem = async (
  TableName: string,
  workItemId: string,
) => {
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });

  const command = new QueryCommand({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': {
        S: `work-item|${workItemId}`,
      },
      ':prefix': {
        S: 'case|',
      },
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk and begins_with(#pk, :prefix)',
    TableName,
  });

  const result = await dynamoClient.send(command);
  if (!result.Items || result.Items.length > 1) {
    throw new Error('we got something unexpected');
  }

  const docketNumber = result.Items[0].pk.S?.split('|')[1];
  return docketNumber;
};
