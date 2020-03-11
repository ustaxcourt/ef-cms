const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseIsInProgress = async ({
  applicationContext,
  caseIsInProgress,
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

  const updateCaseIsInProgress = workItem => {
    return client.update({
      ExpressionAttributeNames: {
        '#caseIsInProgress': 'caseIsInProgress',
      },
      ExpressionAttributeValues: {
        ':caseIsInProgress': caseIsInProgress,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: 'SET #caseIsInProgress = :caseIsInProgress',
      applicationContext,
    });
  };

  await Promise.all(workItems.map(updateCaseIsInProgress));
};
