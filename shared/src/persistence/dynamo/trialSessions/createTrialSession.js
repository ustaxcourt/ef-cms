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
      pk: `trial-session`,
      sk: `${trialSession.trialSessionId}`,
      ...trialSession,
    },
    applicationContext,
  });
};
