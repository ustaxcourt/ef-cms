const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseStatus = ({
  applicationContext,
  caseStatus,
  docketNumber,
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
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #caseStatus = :caseStatus',
    applicationContext,
  });
