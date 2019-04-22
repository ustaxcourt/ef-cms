const client = require('../../dynamodbClientService');

exports.updateDocumentProcessingStatus = async ({ applicationContext, documentIndex, caseId }) => {
  await client.update({
    applicationContext,
    Key: {
      'pk': caseId,
      'sk': '0'
    },
    UpdateExpression: `SET #documents[${documentIndex}].#processingStatus = :status`,
    ExpressionAttributeNames: {
      '#documents': 'documents',
      '#processingStatus': 'processingStatus'
    },
    ExpressionAttributeValues: {
      ':status': 'complete',
    },
  });
};
