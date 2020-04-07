const client = require('../../dynamodbClientService');

exports.associateUserWithCase = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  return client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `case|${caseId}`,
    },
    applicationContext,
  });
};
