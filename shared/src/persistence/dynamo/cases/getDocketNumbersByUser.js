const client = require('../../dynamodbClientService');

exports.getDocketNumbersByUser = async ({ applicationContext, userId }) => {
  const cases = await exports.getCasesAssociatedWithUser({
    applicationContext,
    userId,
  });
  return cases.map(mapping => mapping.sk.split('|')[1]);
};

exports.getCasesAssociatedWithUser = ({ applicationContext, userId }) =>
  client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
