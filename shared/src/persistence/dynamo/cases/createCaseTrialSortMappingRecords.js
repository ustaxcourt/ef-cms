const { put } = require('../../dynamodbClientService');

/**
 * createCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to create the trial sort mapping records for
 * @param {object} providers.caseSortTags the hybrid and nonHybrid sort tags
 */
exports.createCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseId,
  caseSortTags,
}) => {
  const { hybrid, nonHybrid } = caseSortTags;

  await put({
    Item: {
      caseId,
      gsi1pk: `eligible-for-trial-case-catalog|${caseId}`,
      pk: 'eligible-for-trial-case-catalog',
      sk: nonHybrid,
    },
    applicationContext,
  });

  await put({
    Item: {
      caseId,
      gsi1pk: `eligible-for-trial-case-catalog|${caseId}`,
      pk: 'eligible-for-trial-case-catalog',
      sk: hybrid,
    },
    applicationContext,
  });
};
