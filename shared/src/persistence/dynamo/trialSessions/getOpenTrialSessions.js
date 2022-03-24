const { queryFull } = require('../../dynamodbClientService');

exports.getOpenTrialSessions = ({ applicationContext }) =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#isCalendared': 'isCalendared',
      '#isClosed': 'isClosed',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'trial-session-catalog',
      ':isCalendared': true,
      ':isClosed': false,
    },
    FilterExpression:
      '#isCalendared = :isCalendared AND (NOT attribute_exists(#isClosed) or #isClosed = :isClosed)',
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
