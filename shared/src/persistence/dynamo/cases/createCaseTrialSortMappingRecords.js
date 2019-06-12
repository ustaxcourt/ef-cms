const { put } = require('../../dynamodbClientService');

/**
 * createCaseTrailSortMappingRecords
 *
 * @param case
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
      pk: 'eligible-for-trial-case-catalog',
      sk: nonHybrid,
    },
    applicationContext,
  });

  await put({
    Item: {
      caseId,
      pk: 'eligible-for-trial-case-catalog',
      sk: hybrid,
    },
    applicationContext,
  });
};
