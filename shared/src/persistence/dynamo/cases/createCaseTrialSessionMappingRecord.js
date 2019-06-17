const client = require('../../dynamodbClientService');

/**
 * createCaseTrialSessionMappingRecord
 *
 * @param applicationContext
 * @param caseId
 * @param trialSessionId
 * @returns {*}
 */
exports.createCaseTrialSessionMappingRecord = async ({
  applicationContext,
  caseId,
  trialSessionId,
}) => {
  return await client.put({
    Item: {
      caseId,
      pk: 'associated-with-trial-case-catalog',
      sk: trialSessionId,
    },
    applicationContext,
  });
};
