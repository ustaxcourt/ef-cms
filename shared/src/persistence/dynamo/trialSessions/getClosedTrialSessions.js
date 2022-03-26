const { queryFull } = require('../../dynamodbClientService');

exports.getClosedTrialSessions = async ({ applicationContext, isClosed }) => {
  const potentiallyClosedSessions = await queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'trial-session-catalog',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  return potentiallyClosedSessions.filter(isClosed);
};
