const client = require('../../dynamodbClientService');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../../business/entities/EntityConstants');

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
      ':status': DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    },
    Key: {
      pk: `case|${caseId}`,
      sk: `document|${documentId}`,
    },
    UpdateExpression: 'SET #processingStatus = :status',
    applicationContext,
  });
};
