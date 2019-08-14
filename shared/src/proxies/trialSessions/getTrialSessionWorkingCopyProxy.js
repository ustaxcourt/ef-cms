const { get } = require('../requests');

/**
 * getTrialSessionsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTrialSessionWorkingCopyInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/working-copy`,
  });
};
