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
      gsi1pk: `user-case|${caseId}`,
      pk: `user|${userId}`,
      sk: `case|${caseId}`,
    },
    applicationContext,
  });
};
