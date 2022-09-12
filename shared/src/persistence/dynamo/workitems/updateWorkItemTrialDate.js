const client = require('../../dynamodbClientService');

exports.updateWorkItemTrialDate = ({
  applicationContext,
  docketNumber,
  trialDate,
  workItemId,
}) =>
  client.update({
    ExpressionAttributeNames: {
      '#trialDate': 'trialDate',
    },
    ExpressionAttributeValues: {
      ':trialDate': trialDate,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #trialDate = :trialDate',
    applicationContext,
  });
