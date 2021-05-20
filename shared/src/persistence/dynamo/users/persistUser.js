const client = require('../../dynamodbClientService');

exports.persistUser = async ({ applicationContext, user }) => {
  await client.put({
    Item: {
      ...user,
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
    },
    applicationContext,
  });
};
