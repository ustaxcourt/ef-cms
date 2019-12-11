const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseTitle = async ({
  applicationContext,
  caseTitle,
  workItemId,
}) => {
  console.log('++++++++++++++++++ UPDATE CASE TITLE', caseTitle);
  const workItems = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `workitem-${workItemId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  const updateCaseTitle = workItem => {
    return client.update({
      ExpressionAttributeNames: {
        '#caseTitle': 'caseTitle',
      },
      ExpressionAttributeValues: {
        ':caseTitle': caseTitle,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: 'SET #caseTitle = :caseTitle',
      applicationContext,
    });
  };

  await Promise.all(workItems.map(updateCaseTitle));
};
