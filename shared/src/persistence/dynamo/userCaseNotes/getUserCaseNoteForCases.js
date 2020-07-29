const client = require('../../dynamodbClientService');

/**
 * getUserCaseNoteForCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.docketNumbers the docket numbers of the cases to get the case notes for
 * @param {string} providers.userId the id of the user to get the case notes for
 * @returns {Promise} the promise of the persistence call to get the record
 */
exports.getUserCaseNoteForCases = async ({
  applicationContext,
  docketNumbers,
  userId,
}) => {
  return client.batchGet({
    applicationContext,
    keys: docketNumbers.map(docketNumber => ({
      pk: `user-case-note|${docketNumber}`,
      sk: `user|${userId}`,
    })),
  });
};
