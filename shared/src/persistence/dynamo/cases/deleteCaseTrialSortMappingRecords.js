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

  const results = [];

  for (let record of records) {
    const result = await client.delete({
      applicationContext,
      key: {
        pk: record.pk,
        sk: record.sk,
      },
    });
    results.push(result);
  }

  return results;
};
