const client = require('../../dynamodbClientService');

exports.updateUserOnCase = async ({
  applicationContext,
  caseId,
  userToUpdate,
}) => {
  return await client.put({
    Item: {
      pk: `${userToUpdate.userId}|case`,
      sk: caseId,
      ...userToUpdate,
    },
    applicationContext,
  });
};
