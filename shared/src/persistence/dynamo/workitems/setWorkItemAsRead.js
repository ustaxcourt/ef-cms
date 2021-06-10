const client = require('../../dynamodbClientService');

exports.setWorkItemAsRead = async ({ applicationContext, workItemId }) => {
  await client.update({
    ExpressionAttributeNames: {
      '#isRead': 'isRead',
    },
    ExpressionAttributeValues: {
      ':isRead': true,
    },
    Key: {
      pk: `work-item|${workItemId}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #isRead = :isRead',
    applicationContext,
  });
};
