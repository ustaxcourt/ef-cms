const { put } = require('../../dynamodbClientService');

/**
 * createTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionWorkingCopy the trial session working copy data
 * @returns {Promise} the promise of the call to persistence
 */
exports.createTrialSessionWorkingCopy = async ({
  applicationContext,
  trialSessionWorkingCopy,
}) => {
  return await put({
    Item: {
      pk: `trial-session-working-copy|${trialSessionWorkingCopy.trialSessionId}`,
      sk: `${trialSessionWorkingCopy.userId}`,
      ...trialSessionWorkingCopy,
    },
    applicationContext,
  });
};
