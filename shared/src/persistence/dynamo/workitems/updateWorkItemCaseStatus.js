const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseStatus = async ({
  applicationContext,
  caseStatus,
  workItemId,
}) => {
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

  for (let workItem of workItems) {
    await client.update({
      ExpressionAttributeNames: {
        '#caseStatus': 'caseStatus',
      },
      ExpressionAttributeValues: {
        ':caseStatus': caseStatus,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: `SET #caseStatus = :caseStatus`,
      applicationContext,
    });
  }
};
