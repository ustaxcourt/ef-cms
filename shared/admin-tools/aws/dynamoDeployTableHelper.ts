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
  value: boolean;
}): Promise<boolean> => {
  const putItemCommand = new PutItemCommand({
    Item: {
      current: { BOOL: value },
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
}): Promise<boolean> => {
  const getItemCommand = new GetItemCommand({
    Key: {
      pk: { S: key },
      sk: { S: key },
    },
    TableName: `efcms-deploy-${env}`,
  });
  let data;
  let flag = false;
  try {
    data = await dynamodbClient.send(getItemCommand);
    if (
      'Item' in data &&
      'current' in data.Item &&
      'BOOL' in data.Item.current
    ) {
      flag = data.Item.current.BOOL;
    }
  } catch (error) {
    console.log(error);
  }
  return flag;
};
