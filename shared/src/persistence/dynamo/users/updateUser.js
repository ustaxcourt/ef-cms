const client = require('../../dynamodbClientService');

exports.updateUser = async ({ applicationContext, user }) => {
  await client.put({
    Item: {
      pk: user.userId,
      sk: user.userId,
      ...user,
    },
    applicationContext,
  });
};
