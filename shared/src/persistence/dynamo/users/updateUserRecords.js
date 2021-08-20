const client = require('../../dynamodbClientService');

exports.updateUserRecords = async ({
  applicationContext,
  oldUser,
  updatedUser,
  userId,
}) => {
  await Promise.all([
    client.delete({
      applicationContext,
      key: {
        pk: `section|${oldUser.section}`,
        sk: `user|${userId}`,
      },
    }),

    client.put({
      Item: {
        ...updatedUser,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        userId,
      },
      applicationContext,
    }),

    client.delete({
      applicationContext,
      key: {
        pk: `${oldUser.role}|${oldUser.name}`,
        sk: `user|${userId}`,
      },
    }),

    client.delete({
      applicationContext,
      key: {
        pk: `${oldUser.role}|${oldUser.barNumber}`,
        sk: `user|${userId}`,
      },
    }),

    client.put({
      Item: {
        pk: `${updatedUser.role}|${updatedUser.name}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    }),

    client.put({
      Item: {
        pk: `${updatedUser.role}|${updatedUser.barNumber}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    }),
  ]);

  return {
    ...updatedUser,
    userId,
  };
};
