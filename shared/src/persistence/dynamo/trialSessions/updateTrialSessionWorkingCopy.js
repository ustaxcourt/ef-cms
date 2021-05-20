const client = require('../../dynamodbClientService');

/**
 * updateTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionWorkingCopyToUpdate the trial session working copy data to update
 * @returns {Promise} the promise of the call to persistence
 */
exports.updateTrialSessionWorkingCopy = async ({
  applicationContext,
  trialSessionWorkingCopyToUpdate,
}) => {
  return await client.put({
    Item: {
      ...trialSessionWorkingCopyToUpdate,
      pk: `trial-session-working-copy|${trialSessionWorkingCopyToUpdate.trialSessionId}`,
      sk: `user|${trialSessionWorkingCopyToUpdate.userId}`,
    },
    applicationContext,
  });
};
