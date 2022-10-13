const { remove } = require('../../dynamodbClientService');

/**
 * removeCaseFromHearing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber docket number of the case to remove
 * @param {object} providers.trialSessionId trial session ID to remove from hearings association
 * @returns {Promise} the promise of the call to persistence
 */
exports.removeCaseFromHearing = ({
  applicationContext,
  docketNumber,
  trialSessionId,
}) =>
  remove({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `hearing|${trialSessionId}`,
    },
  });
