const client = require('../../dynamodbClientService');

exports.getDocketNumbersByUser = async ({ applicationContext, userId }) => {
  return (
    await client.query({
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
    })
  ).map(mapping => mapping.sk.split('|')[1]);
};
