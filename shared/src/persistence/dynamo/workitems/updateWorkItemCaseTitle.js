const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseTitle = ({
  applicationContext,
  caseTitle,
  workItemId,
}) =>
  client.update({
    ExpressionAttributeNames: {
      '#caseTitle': 'caseTitle',
    },
    ExpressionAttributeValues: {
      ':caseTitle': caseTitle,
    },
    Key: {
      pk: `work-item|${workItemId}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #caseTitle = :caseTitle',
    applicationContext,
  });
