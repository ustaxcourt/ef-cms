const client = require('../../dynamodbClientService');

exports.updateWorkItemDocketNumberSuffix = async ({
  workItemId,
  docketNumberSuffix,
  applicationContext,
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
        '#docketNumberSuffix': 'docketNumberSuffix',
      },
      ExpressionAttributeValues: {
        ':docketNumberSuffix': docketNumberSuffix,
      },
      Key: {
        pk: workItem.pk,
        sk: workItem.sk,
      },
      UpdateExpression: `SET #docketNumberSuffix = :docketNumberSuffix`,
      applicationContext,
    });
  }
};
