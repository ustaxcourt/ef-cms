const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getUsersInSection = async ({ applicationContext, section }) => {
  const users = await client.query({
    applicationContext,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${section}|user`,
    },
    KeyConditionExpression: '#pk = :pk',
  });

  return stripInternalKeys(users);
};
