const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  deleteCaseTrialSortMappingRecords,
} = require('./deleteCaseTrialSortMappingRecords');

/**
 * updateCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update the mapping records
 * @param {object} providers.caseSortTags the hybrid and nonHybrid sort tags
 */
exports.updateCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseSortTags,
  docketNumber,
}) => {
  const { hybrid, nonHybrid } = caseSortTags;

  const oldSortRecords = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `eligible-for-trial-case-catalog|${docketNumber}`,
      ':pk': 'eligible-for-trial-case-catalog',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk AND #pk = :pk',
    applicationContext,
  });

  if (
    oldSortRecords.length &&
    oldSortRecords[0].sk !== hybrid &&
    oldSortRecords[0].sk !== nonHybrid
  ) {
    await deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber,
    });

    await client.put({
      Item: {
        docketNumber,
        gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: nonHybrid,
      },
      applicationContext,
    });

    await client.put({
      Item: {
        docketNumber,
        gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: hybrid,
      },
      applicationContext,
    });
  }
};
