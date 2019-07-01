const { query } = require('../../dynamodbClientService');

exports.getDocumentQCInboxForSection = async ({
  applicationContext,
  section,
}) => {
  const workItems = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `section-${section}`,
      ':prefix': 'workitem',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
  return workItems.filter(
    workItem => !workItem.completedAt && !workItem.isInternal,
  );
};
