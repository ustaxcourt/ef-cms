const client = require('../../dynamodbClientService');

exports.deleteUserOutboxRecord = ({
  applicationContext,
  userId,
  createdAt,
}) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `user-outbox-${userId}`,
      sk: createdAt,
    },
  });
};
