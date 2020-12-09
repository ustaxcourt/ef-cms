const { put } = require('../../dynamodbClientService');

/**
 * addHearingToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber docket number of the case to add
 * @param {object} providers.trialSession trial session to add as a hearing
 * @returns {Promise} the promise of the call to persistence
 */
exports.addHearingToCase = async ({
  applicationContext,
  docketNumber,
  trialSession,
}) => {
  return await put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `hearing|${trialSession.trialSessionId}`,
      ...trialSession,
    },
    applicationContext,
  });
};
