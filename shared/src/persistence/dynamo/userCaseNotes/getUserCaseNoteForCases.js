const client = require('../../dynamodbClientService');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');

/**
 * getUserCaseNoteForCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.caseIds the id of the case to get the case notes for
 * @param {string} providers.userId the id of the user to get the case notes for
 * @returns {Promise} the promise of the persistence call to get the record
 */
exports.getUserCaseNoteForCases = async ({
  applicationContext,
  docketNumbers,
  userId,
}) => {
  let caseIds = [];
  for (let docketNumber of docketNumbers) {
    const caseId = await getCaseIdFromDocketNumber({
      applicationContext,
      docketNumber,
    });
    caseIds.push(caseId);
  }

  return client.batchGet({
    applicationContext,
    keys: caseIds.map(caseId => ({
      pk: `user-case-note|${caseId}`,
      sk: `user|${userId}`,
    })),
  });
};
