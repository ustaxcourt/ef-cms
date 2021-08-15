const client = require('../../dynamodbClientService');

exports.associateUserWithCase = ({
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
