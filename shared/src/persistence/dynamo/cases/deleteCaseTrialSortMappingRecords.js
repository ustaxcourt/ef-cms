const client = require('../../dynamodbClientService');

/**
 * deleteCaseTrialSortMappingRecords
 *
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.deleteCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseId,
}) => {
  const records = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `eligible-for-trial-case-catalog-${caseId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  const clientDelete = record => {
    return client.delete({
      applicationContext,
      key: {
        pk: record.pk,
        sk: record.sk,
      },
    });
  };

  const results = await Promise.all(records.map(clientDelete));

  return results;
};
