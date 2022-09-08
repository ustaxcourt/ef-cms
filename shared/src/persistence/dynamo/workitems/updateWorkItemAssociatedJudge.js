const client = require('../../dynamodbClientService');

exports.updateWorkItemAssociatedJudge = ({
  applicationContext,
  associatedJudge,
  docketNumber,
  workItemId,
}) =>
  client.update({
    ExpressionAttributeNames: {
      '#associatedJudge': 'associatedJudge',
    },
    ExpressionAttributeValues: {
      ':associatedJudge': associatedJudge,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #associatedJudge = :associatedJudge',
    applicationContext,
  });
