const moment = require('moment');
const { query } = require('../../dynamodbClientService');

exports.getSentMessagesForSection = async ({ applicationContext, section }) => {
  const afterDate = moment
    .utc(new Date().toISOString())
    .startOf('day')
    .subtract(7, 'd')
    .utc()
    .format();

  const workItems = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `section-outbox-${section}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });

  return workItems.filter(workItem => workItem.isInternal);
};
