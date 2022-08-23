const client = require('../../dynamodbClientService');

exports.updateWorkItemCaseTitle = ({
  applicationContext,
  caseTitle,
  docketNumber,
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
      pk: `case|${docketNumber}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #caseTitle = :caseTitle',
    applicationContext,
  });
