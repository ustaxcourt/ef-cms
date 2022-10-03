import * as client from '../../dynamodbClientService';

export const updateUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: TUser;
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
