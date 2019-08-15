const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

/**
 * getTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.userId the id of the user
 * @returns {Promise} the promise of the call to persistence
 */
exports.getTrialSessionWorkingCopy = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  return await client
    .get({
      Key: {
        pk: `trial-session-working-copy|${trialSessionId}`,
        sk: `${userId}`,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
