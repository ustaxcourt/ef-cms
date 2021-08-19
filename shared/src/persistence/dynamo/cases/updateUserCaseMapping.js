const client = require('../../dynamodbClientService');

exports.updateUserCaseMapping = ({ applicationContext, userCaseItem }) => {
  return client.put({
    Item: {
      ...userCaseItem,
      gsi1pk: `user-case|${userCaseItem.docketNumber}`,
    },
    applicationContext,
  });
};
