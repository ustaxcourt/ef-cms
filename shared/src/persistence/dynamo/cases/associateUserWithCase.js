const client = require('../../dynamodbClientService');

exports.associateUserWithCase = async ({
  applicationContext,
  caseId,
  userCase,
  userId,
}) => {
  return client.put({
    Item: {
      ...userCase,
      pk: `user|${userId}`,
      sk: `case|${caseId}`,
    },
    applicationContext,
  });
};
