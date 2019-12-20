const client = require('../../dynamodbClientService');

/**
 * deleteTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionWorkingCopy the trial session working copy data
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteTrialSessionWorkingCopy = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  return await client.delete({
    applicationContext,
    key: {
      pk: `trial-session-working-copy|${trialSessionId}`,
      sk: `${userId}`,
    },
  });
};
