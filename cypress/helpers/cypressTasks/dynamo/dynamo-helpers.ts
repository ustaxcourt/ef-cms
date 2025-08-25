import { getCypressEnv } from '../../env/cypressEnvironment';
import { getDocumentClient } from './getDynamoCypress';

export const toggleFeatureFlag = async ({
  flag,
  flagValue,
}: {
  flag: string;
  flagValue: any;
}): Promise<null> => {
  const dynamoClient = await getDocumentClient();
  await dynamoClient.update({
    ExpressionAttributeNames: {
      '#value': 'current',
    },
    ExpressionAttributeValues: {
      ':value': flagValue,
    },
    Key: {
      pk: flag,
      sk: flag,
    },
    TableName: getCypressEnv().dynamoDbDeployTableName,
    UpdateExpression: 'SET #value = :value',
  });

  return null;
};

export const getFeatureFlagValue = async ({
  flag,
}: {
  flag: string;
}): Promise<boolean> => {
  const dynamoClient = await getDocumentClient();
  const result = await dynamoClient.get({
    Key: {
      pk: flag,
      sk: flag,
    },
    TableName: getCypressEnv().dynamoDbDeployTableName,
  });

  return !!result?.Item?.current;
};

export const getRawFeatureFlagValue = async ({
  flag,
}: {
  flag: string;
}): Promise<boolean | undefined> => {
  const dynamoClient = await getDocumentClient();
  const result = await dynamoClient.get({
    Key: {
      pk: flag,
      sk: flag,
    },
    TableName: getCypressEnv().dynamoDbDeployTableName,
  });

  return result?.Item?.current || null;
};
