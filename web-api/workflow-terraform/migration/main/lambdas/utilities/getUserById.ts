import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import type { RawUser } from '@shared/business/entities/User';

export const getUserById = async (
  documentClient: DynamoDBDocument,
  userId: string,
): Promise<RawUser> => {
  const result = await documentClient.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    TableName: process.env.SOURCE_TABLE!,
  });
  return result.Item as RawUser;
};
