const client = require('../../dynamodbClientService');

exports.updateWorkItemAssociatedJudge = ({
  applicationContext,
  associatedJudge,
  workItem,
}) =>
  client.update({
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
