const { DateTime } = require('luxon');
const { queryFull } = require('../../dynamodbClientService');

exports.getDocumentQCServedForSection = ({ applicationContext, section }) => {
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
      ':pk': `section-outbox|${section}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });
};
