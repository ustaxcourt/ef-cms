export const getUserById = (
  documentClient: AWS.DynamoDB.DocumentClient,
  userId: string,
) => {
  return documentClient
    .get({
      Key: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
      },
      TableName: process.env.SOURCE_TABLE!,
    })
    .promise() as Promise<{ Item: RawUser | undefined }>;
};
