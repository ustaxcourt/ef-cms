const client = require('../../dynamodbClientService');

exports.associateUserWithCasePending = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  return client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `pending-case|${docketNumber}`,
    },
    applicationContext,
  });
};
