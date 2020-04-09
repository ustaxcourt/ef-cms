const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseCaption = async ({
  applicationContext,
  caseCaption,
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

  const updateCaseCaption = workItem => {
    return client.update({
      ExpressionAttributeNames: {
        '#caseCaption': 'caseCaption',
      },
      ExpressionAttributeValues: {
        ':caseCaption': caseCaption,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: 'SET #caseCaption = :caseCaption',
      applicationContext,
    });
  };

  await Promise.all(workItems.map(updateCaseCaption));
};
