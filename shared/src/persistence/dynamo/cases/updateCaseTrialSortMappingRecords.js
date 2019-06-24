const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  deleteCaseTrialSortMappingRecords,
} = require('./deleteCaseTrialSortMappingRecords');

/**
 * updateCaseTrialSortMappingRecords
 *
 * @param case
 * @param applicationContext
 * @returns {*}
 */
exports.updateCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseId,
  caseSortTags,
}) => {
  const { hybrid, nonHybrid } = caseSortTags;

  const oldSortRecords = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `eligible-for-trial-case-catalog-{caseId}`,
      ':pk': 'eligible-for-trial-case-catalog',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pkpk AND #pk = :pk',
    applicationContext,
  });

  if (
    oldSortRecords.length &&
    (oldSortRecords[0].sk !== hybrid && oldSortRecords[0].sk !== nonHybrid)
  ) {
    await deleteCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
    });

    await client.put({
      Item: {
        caseId,
        gsi1pk: `eligible-for-trial-case-catalog-${caseId}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: nonHybrid,
      },
      applicationContext,
    });

    await client.put({
      Item: {
        caseId,
        gsi1pk: `eligible-for-trial-case-catalog-${caseId}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: hybrid,
      },
      applicationContext,
    });
  }
};
