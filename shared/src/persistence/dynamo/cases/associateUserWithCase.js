const client = require('../../dynamodbClientService');

exports.associateUserWithCase = async ({
  applicationContext,
  userId,
  caseId,
}) => {
  return client.put({
    Item: {
      pk: `${userId}|case`,
      sk: caseId,
    },
    applicationContext,
  });
};
