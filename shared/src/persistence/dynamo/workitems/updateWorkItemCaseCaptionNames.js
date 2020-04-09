const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseCaptionNames = async ({
  applicationContext,
  caseCaptionNames,
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

  const updateCaseCaptionNames = workItem => {
    return client.update({
      ExpressionAttributeNames: {
        '#caseCaptionNames': 'caseCaptionNames',
      },
      ExpressionAttributeValues: {
        ':caseCaptionNames': caseCaptionNames,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: 'SET #caseCaptionNames = :caseCaptionNames',
      applicationContext,
    });
  };

  await Promise.all(workItems.map(updateCaseCaptionNames));
};
