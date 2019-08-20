const {
  prepareDateFromString,
} = require('../../../business/utilities/DateHandler');
const { query } = require('../../dynamodbClientService');

exports.getDocumentQCServedForUser = async ({ applicationContext, userId }) => {
  const afterDate = prepareDateFromString()
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
      ':pk': `user-outbox-${userId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });

  return workItems.filter(
    workItem =>
      !workItem.isInternal &&
      workItem.completedByUserId &&
      workItem.completedByUserId === userId &&
      !!workItem.completedAt,
  );
};
