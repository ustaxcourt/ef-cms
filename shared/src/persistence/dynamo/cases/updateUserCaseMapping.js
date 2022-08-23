const client = require('../../dynamodbClientService');

exports.updateUserCaseMapping = ({ applicationContext, userCaseItem }) =>
  client.put({
    Item: {
      ...userCaseItem,
      gsi1pk: `user-case|${userCaseItem.docketNumber}`,
    },
    applicationContext,
  });
