const client = require('../../dynamodbClientService');

exports.updateWorkItemTrialDate = ({
  applicationContext,
  trialDate,
  workItem,
}) =>
  client.update({
    ExpressionAttributeNames: {
      '#trialDate': 'trialDate',
    },
    ExpressionAttributeValues: {
      ':trialDate': trialDate,
    },
    Key: {
      pk: workItem.pk,
      sk: workItem.sk,
    },
    UpdateExpression: 'SET #trialDate = :trialDate',
    applicationContext,
  });
