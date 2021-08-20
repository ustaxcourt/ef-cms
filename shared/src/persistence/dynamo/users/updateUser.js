const { put } = require('../../dynamodbClientService');

exports.updateUser = ({ applicationContext, user }) =>
  put({
    Item: {
      ...user,
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
    },
    applicationContext,
  });
