const client = require('../../dynamodbClientService');

/**
 * deleteCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to delete the mapping records for
 * @returns {Promise} the return from the persistence delete calls
 */
exports.deleteCaseTrialSortMappingRecords = async ({
  applicationContext,
  docketNumber,
}) => {
  const records = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `eligible-for-trial-case-catalog|${docketNumber}`,
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
