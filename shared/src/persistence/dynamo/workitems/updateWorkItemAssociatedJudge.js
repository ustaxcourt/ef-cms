const client = require('../../dynamodbClientService');

exports.updateWorkItemAssociatedJudge = async ({
  applicationContext,
  associatedJudge,
  workItemId,
}) => {
  const workItems = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `work-item|${workItemId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  for (let workItem of workItems) {
    await client.update({
      ExpressionAttributeNames: {
        '#associatedJudge': 'associatedJudge',
      },
      ExpressionAttributeValues: {
        ':associatedJudge': associatedJudge,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: 'SET #associatedJudge = :associatedJudge',
      applicationContext,
    });
  }
};
