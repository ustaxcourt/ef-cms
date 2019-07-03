const client = require('../../dynamodbClientService');

exports.associateUserWithCasePending = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  return client.put({
    Item: {
      pk: `${userId}|case|pending`,
      sk: caseId,
    },
    applicationContext,
  });
};
