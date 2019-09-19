const client = require('../../dynamodbClientService');

/**
 * createTrialSession
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteUserConnection = async ({
  applicationContext,
  connectionId,
  userId,
}) => {
  return await client.delete({
    applicationContext,
    key: {
      pk: `connections-${userId}`,
      sk: connectionId,
    },
  });
};
