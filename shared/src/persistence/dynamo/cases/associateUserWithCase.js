const client = require('../../dynamodbClientService');

exports.associateUserWithCase = async ({
  applicationContext,
  docketNumber,
  userCase,
  userId,
}) => {
  return client.put({
    Item: {
      ...userCase,
      gsi1pk: `user-case|${docketNumber}`,
      pk: `user|${userId}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });
};
