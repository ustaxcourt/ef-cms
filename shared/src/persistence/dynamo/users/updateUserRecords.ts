import * as client from '../../dynamodbClientService';

export const updateUserRecords = async ({
  applicationContext,
  oldUser,
  updatedUser,
  userId,
}: {
  applicationContext: IApplicationContext;
  oldUser: any;
  updatedUser: any;
  userId: string;
}) => {
  await client.remove({
    applicationContext,
    key: {
      pk: `section|${oldUser.section}`,
      sk: `user|${userId}`,
    },
  });

  await client.put({
    Item: {
      ...updatedUser,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  await client.remove({
    applicationContext,
    key: {
      pk: `${oldUser.role}|${oldUser.name}`,
      sk: `user|${userId}`,
    },
  });

  await client.remove({
    applicationContext,
    key: {
      pk: `${oldUser.role}|${oldUser.barNumber}`,
      sk: `user|${userId}`,
    },
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.name}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.barNumber}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  return {
    ...updatedUser,
    userId,
  };
};
