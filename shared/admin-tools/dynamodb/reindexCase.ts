import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

export const reindexCase = async (TableName: string, docketNumber: string) => {
  console.log('reindexCase', docketNumber);

  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });

  // get all of the sks
  const command = new QueryCommand({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': { S: `case|${docketNumber}` },
    },
    KeyConditionExpression: '#pk = :pk',
    ProjectionExpression: '#sk',
    TableName,
  });

  const result = await dynamoClient.send(command);

  if (!result.Items || result.Items.length === 0) {
    throw new Error("we didn't get any items!!!");
  }

  for (const item of result.Items) {
    const updateCommand = new UpdateItemCommand({
      ExpressionAttributeNames: {
        '#indexedTimestamp': 'indexedTimestamp',
      },
      ExpressionAttributeValues: {
        ':indexedTimestamp': {
          N: `${Date.now()}`,
        },
      },
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: item.sk.S!,
        },
      },
      TableName,
      UpdateExpression: 'SET #indexedTimestamp = :indexedTimestamp',
    });

    await dynamoClient.send(updateCommand);
  }
};
