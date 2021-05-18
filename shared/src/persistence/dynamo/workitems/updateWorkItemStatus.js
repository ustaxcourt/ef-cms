const client = require('../../dynamodbClientService');

exports.updateWorkItemStatus = ({ applicationContext, caseStatus, workItem }) =>
  client.update({
    ExpressionAttributeNames: {
      '#caseStatus': 'caseStatus',
    },
    ExpressionAttributeValues: {
      ':caseStatus': caseStatus,
    },
    Key: {
      pk: workItem.pk,
      sk: workItem.sk,
    },
    UpdateExpression: 'SET #caseStatus = :caseStatus',
    applicationContext,
  });
