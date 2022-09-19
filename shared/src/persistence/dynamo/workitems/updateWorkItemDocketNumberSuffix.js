const client = require('../../dynamodbClientService');

exports.updateWorkItemDocketNumberSuffix = ({
  applicationContext,
  docketNumber,
  docketNumberSuffix,
  workItemId,
}) =>
  client.update({
    ExpressionAttributeNames: {
      '#docketNumberSuffix': 'docketNumberSuffix',
    },
    ExpressionAttributeValues: {
      ':docketNumberSuffix': docketNumberSuffix,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #docketNumberSuffix = :docketNumberSuffix',
    applicationContext,
  });
