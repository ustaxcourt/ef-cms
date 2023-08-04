import * as client from '../../dynamodbClientService';

export const updateUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  await client.put({
    Item: {
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
      ...user,
    },
    applicationContext,
  });
};
