const client = require('../../dynamodbClientService');

/**
 * deleteTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @param {object} providers.userId the userId of the working copy
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteTrialSessionWorkingCopy = ({
  applicationContext,
  trialSessionId,
  userId,
}) =>
  client.remove({
    applicationContext,
    key: {
      pk: `trial-session-working-copy|${trialSessionId}`,
      sk: `user|${userId}`,
    },
  });
