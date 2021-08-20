const { put } = require('../../dynamodbClientService');

exports.persistUser = ({ applicationContext, user }) =>
  put({
    Item: {
      ...user,
      pk: `user|${user.userId}`,
      sk: `user|${user.userId}`,
    },
    applicationContext,
  });
