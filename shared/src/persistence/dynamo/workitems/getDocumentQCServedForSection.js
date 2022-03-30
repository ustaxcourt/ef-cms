const { queryFull } = require('../../dynamodbClientService');

exports.getDocumentQCServedForSection = ({
  afterDate,
  applicationContext,
  section,
}) => {
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
