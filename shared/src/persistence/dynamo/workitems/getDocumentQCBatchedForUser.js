const moment = require('moment');
const { query } = require('../../dynamodbClientService');

exports.getDocumentQCBatchedForUser = async ({
  applicationContext,
  userId,
}) => {
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
      ':pk': `user-outbox-${userId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });

  return workItems.filter(
    workItem =>
      !workItem.isInternal &&
      workItem.sentByUserId === userId &&
      workItem.section === 'irsBatchSection' &&
      workItem.caseStatus === 'Batched for IRS',
  );
};
