const client = require('../../dynamodbClientService');

exports.persistUser = async ({ applicationContext, user }) => {
  await client.put({
    Item: {
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
      ...user,
    },
    applicationContext,
  });
};
