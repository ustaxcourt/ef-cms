const client = require('../../dynamodbClientService');

exports.updateWorkItemTrialDate = async ({
  applicationContext,
  trialDate,
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
        '#trialDate': 'trialDate',
      },
      ExpressionAttributeValues: {
        ':trialDate': trialDate,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: 'SET #trialDate = :trialDate',
      applicationContext,
    });
  }
};
