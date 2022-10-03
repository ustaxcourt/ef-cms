const client = require('../../dynamodbClientService');

exports.updateUser = async ({ applicationContext, user }) => {
  await client.put({
    Item: {
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
      ...user,
    },
    applicationContext,
  });
};
