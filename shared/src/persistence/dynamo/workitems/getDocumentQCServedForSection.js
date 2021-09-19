const {
  prepareDateFromString,
} = require('../../../business/utilities/DateHandler');
const { queryFull } = require('../../dynamodbClientService');

exports.getDocumentQCServedForSection = ({ applicationContext, section }) => {
  const afterDate = prepareDateFromString()
    .startOf('day')
    .subtract(7, 'd')
    .utc()
    .format();

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
