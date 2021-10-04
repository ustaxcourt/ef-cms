const client = require('../../dynamodbClientService');

exports.deleteUserOutboxRecord = ({ applicationContext, createdAt, userId }) =>
  client.delete({
    applicationContext,
    key: {
      pk: `user-outbox|${userId}`,
      sk: createdAt,
    },
  });
