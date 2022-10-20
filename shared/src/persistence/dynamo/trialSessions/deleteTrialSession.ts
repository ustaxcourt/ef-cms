const client = require('../../dynamodbClientService');

/**
 * deleteTrialSession
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteTrialSession = ({ applicationContext, trialSessionId }) =>
  client.remove({
    applicationContext,
    key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
  });
