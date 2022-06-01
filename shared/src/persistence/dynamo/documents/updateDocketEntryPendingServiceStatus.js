const client = require('../../dynamodbClientService');

exports.updateDocketEntryPendingServiceStatus = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
  status,
}) => {
  // updated to conditional update since this function should never create a docket entry record if it does not already exist
  await client.update({
    ConditionExpression: 'attribute_exists(docketEntryId)',
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
