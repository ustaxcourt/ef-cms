const client = require('../../dynamodbClientService');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../../business/entities/EntityConstants');

exports.updateDocketEntryProcessingStatus = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#processingStatus': 'processingStatus',
    },
    ExpressionAttributeValues: {
      ':status': DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
    UpdateExpression: 'SET #processingStatus = :status',
    applicationContext,
  });
};
