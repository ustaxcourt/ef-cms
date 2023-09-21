import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' });

export const putItem = async ({
  env,
  key,
  value,
}: {
  env: string;
  key: string;
  value: boolean | string;
}): Promise<boolean> => {
  const current = typeof value === 'boolean' ? { BOOL: value } : { S: value };
  const putItemCommand = new PutItemCommand({
    Item: {
      current,
      pk: { S: key },
      sk: { S: key },
    },
    TableName: `efcms-deploy-${env}`,
  });
  let result = false;
  try {
    await dynamodbClient.send(putItemCommand);
    result = true;
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const getItem = async ({
  env,
  key,
}: {
  env: string;
  key: string;
}): Promise<boolean | string> => {
  const getItemCommand = new GetItemCommand({
    Key: {
      pk: { S: key },
      sk: { S: key },
    },
    TableName: `efcms-deploy-${env}`,
  });
  let value;
  try {
    const result = await dynamodbClient.send(getItemCommand);
    if ('Item' in result && result.Item && 'current' in result.Item) {
      if (
        'BOOL' in result.Item.current &&
        typeof result.Item.current.BOOL === 'boolean'
      ) {
        value = result.Item.current.BOOL;
      } else if (
        'S' in result.Item.current &&
        typeof result.Item.current.S === 'string'
      ) {
        value = result.Item.current.S;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return typeof value === 'undefined' ? false : value;
};
