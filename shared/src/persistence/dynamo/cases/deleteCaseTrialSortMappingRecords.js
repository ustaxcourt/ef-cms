const client = require('../../dynamodbClientService');

/**
 * deleteCaseTrialSortMappingRecords
 *
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.deleteCaseTrialSortMappingRecords = async ({
  caseId,
  applicationContext,
}) => {
  return client.delete({
    applicationContext,
    key: {
      gsi1pk: `eligible-for-trial-case-catalog-${caseId}`,
    },
  });
};
