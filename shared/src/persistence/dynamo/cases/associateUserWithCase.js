const client = require('../../dynamodbClientService');

exports.associateUserWithCase = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  return client.put({
    Item: {
      pk: `${userId}|case`,
      sk: caseId,
    },
    applicationContext,
  });
};
