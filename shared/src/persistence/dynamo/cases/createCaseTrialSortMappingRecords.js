const { put } = require('../../dynamodbClientService');

/**
 * createCaseTrialSortMappingRecords
 *
 * @param caseId
 * @param caseSortTags
 * @param applicationContext
 * @returns {*}
 */
exports.createCaseTrialSortMappingRecords = async ({
  caseId,
  caseSortTags,
  applicationContext,
}) => {
  const { hybrid, nonHybrid } = caseSortTags;

  await put({
    Item: {
      caseId,
      gsi1pk: `eligible-for-trial-case-catalog-${caseId}`,
      pk: 'eligible-for-trial-case-catalog',
      sk: nonHybrid,
    },
    applicationContext,
  });

  await put({
    Item: {
      caseId,
      gsi1pk: `eligible-for-trial-case-catalog-${caseId}`,
      pk: 'eligible-for-trial-case-catalog',
      sk: hybrid,
    },
    applicationContext,
  });
};
