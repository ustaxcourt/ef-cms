const client = require('../../dynamodbClientService');

exports.updateWorkItemDocketNumberSuffix = ({
  applicationContext,
  docketNumberSuffix,
  workItem,
}) =>
  client.update({
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
    UpdateExpression: 'SET #docketNumberSuffix = :docketNumberSuffix',
    applicationContext,
  });
