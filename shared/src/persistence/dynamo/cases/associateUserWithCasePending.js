const client = require('../../dynamodbClientService');

exports.associateUserWithCasePending = ({
  applicationContext,
  docketNumber,
  userId,
}) =>
  client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `pending-case|${docketNumber}`,
    },
    applicationContext,
  });
