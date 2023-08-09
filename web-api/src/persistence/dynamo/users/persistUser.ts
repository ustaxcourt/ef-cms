import * as client from '../../dynamodbClientService';

export const persistUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  await client.put({
    Item: {
      ...user,
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
    },
    applicationContext,
  });
};
