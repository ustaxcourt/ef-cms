const { put } = require('../../dynamodbClientService');

/**
 * createTrialSession
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise} the promise of the call to persistence
 */
exports.createTrialSession = async ({ applicationContext, trialSession }) => {
  return await put({
    Item: {
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session-${trialSession.trialSessionId}`,
      sk: `trial-session-${trialSession.trialSessionId}`,
      ...trialSession,
    },
    applicationContext,
  });
};
