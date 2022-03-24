const { queryFull } = require('../../dynamodbClientService');

exports.getNewTrialSessions = ({ applicationContext }) =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#isCalendared': 'isCalendared',
      '#isClosed': 'isClosed',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'trial-session-catalog',
      ':isCalendared': false,
      ':isClosed': false,
    },
    FilterExpression:
      '#isCalendared = :isCalendared AND (#isClosed = :isClosed OR attribute_not_exists(#isClosed))',
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
