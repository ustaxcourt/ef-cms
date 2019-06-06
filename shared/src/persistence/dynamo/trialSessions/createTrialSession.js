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
      pk: `${trialSession.trialSessionId}`,
      sk: 'trial-session',
      gsi1pk: 'trial-session-catalog',
      ...trialSession,
    },
    applicationContext,
  });
};
