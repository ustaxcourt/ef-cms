const client = require('../../dynamodbClientService');

exports.updateDocketEntryPendingServiceStatus = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
  status,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#isPendingService': 'isPendingService',
    },
    ExpressionAttributeValues: {
      ':status': status,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
    UpdateExpression: 'SET #isPendingService = :status',
    applicationContext,
  });
};
