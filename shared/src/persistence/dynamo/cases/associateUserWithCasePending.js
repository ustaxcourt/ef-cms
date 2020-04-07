const client = require('../../dynamodbClientService');

exports.associateUserWithCasePending = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  return client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `pending-case|${caseId}`,
    },
    applicationContext,
  });
};
