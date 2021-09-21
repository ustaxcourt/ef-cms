const { DateTime } = require('luxon');
const { queryFull } = require('../../dynamodbClientService');

exports.getDocumentQCServedForUser = ({ applicationContext, userId }) => {
  const afterDate = DateTime.now()
    .setZone('America/New_York')
    .minus(7, 'days')
    .setZone('utc')
    .toISO();

  return queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `user-outbox|${userId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });
};
