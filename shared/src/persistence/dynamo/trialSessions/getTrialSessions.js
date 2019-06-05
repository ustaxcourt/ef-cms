const { query } = require('../../dynamodbClientService');

exports.getTrialSessions = async ({ applicationContext }) => {
  return query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': 'trial-session',
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });
};
