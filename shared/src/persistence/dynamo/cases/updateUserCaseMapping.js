const client = require('../../dynamodbClientService');

exports.updateUserCaseMapping = ({ applicationContext, userCaseItem }) =>
  client.put({
    Item: {
      ...userCaseItem,
      gsi1pk: `user-case|${userCaseItem.docketNumber}`,
      pk: `user|${userCaseItem.userId}`,
      sk: `case|${userCaseItem.docketNumber}`,
    },
    applicationContext,
  });
