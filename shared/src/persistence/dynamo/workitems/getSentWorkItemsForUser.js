const client = require('../../dynamodbClientService');
const moment = require('moment');

exports.getSentWorkItemsForUser = async ({ applicationContext, userId }) => {
  const afterDate = moment
    .utc(new Date().toISOString())
    .startOf('day')
    .subtract(7, 'd')
    .utc()
    .format();

  return client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `user-outbox-${userId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });
};
