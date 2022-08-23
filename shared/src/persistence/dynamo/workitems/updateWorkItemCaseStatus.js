const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseStatus = ({
  applicationContext,
  caseStatus,
  workItemId,
}) =>
  client.update({
    ExpressionAttributeNames: {
      '#caseStatus': 'caseStatus',
    },
    ExpressionAttributeValues: {
      ':caseStatus': caseStatus,
    },
    Key: {
      pk: `work-item|${workItemId}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #caseStatus = :caseStatus',
    applicationContext,
  });
