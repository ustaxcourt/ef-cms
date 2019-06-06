const { put } = require('../../dynamodbClientService');

/**
 * createTrialSession
 *
 * @param trialSession
 * @param applicationContext
 * @returns {*}
 */
exports.createTrialSession = async ({ trialSession, applicationContext }) => {
  await put({
    Item: {
      pk: `trial-session-${trialSession.trialSessionId}`,
      sk: `trial-session-${trialSession.trialSessionId}`,
      gsi1pk: 'trial-session-catalog',
      ...trialSession,
    },
    applicationContext,
  });
};
