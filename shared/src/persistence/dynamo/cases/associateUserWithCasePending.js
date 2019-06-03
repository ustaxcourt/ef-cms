const client = require('../../dynamodbClientService');

exports.associateUserWithCasePending = async ({
  applicationContext,
  userId,
  caseId,
}) => {
  return client.put({
    Item: {
      pk: `${userId}|case|pending`,
      sk: caseId,
    },
    applicationContext,
  });
};
