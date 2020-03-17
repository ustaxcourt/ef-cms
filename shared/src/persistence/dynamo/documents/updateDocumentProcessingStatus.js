const client = require('../../dynamodbClientService');

exports.updateDocumentProcessingStatus = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#processingStatus': 'processingStatus',
    },
    ExpressionAttributeValues: {
      ':status': 'complete',
    },
    Key: {
      pk: `case|${caseId}`,
      sk: `document|${documentId}`,
    },
    UpdateExpression: 'SET #processingStatus = :status',
    applicationContext,
  });
};
