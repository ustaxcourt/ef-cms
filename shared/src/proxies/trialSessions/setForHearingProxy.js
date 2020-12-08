const { post } = require('../requests');

/**
 * set hearing for trial session and case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber of the case to add the trial session set for hearing
 * @param {string} providers.trialSessionId the id of the trial session to set the calendar
 * @returns {Promise<*>} the promise of the api call
 */
exports.setForHearingInteractor = ({
  applicationContext,
  docketNumber,
  note,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: {
      note,
    },
    endpoint: `/trial-sessions/${trialSessionId}/set-hearing/${docketNumber}`,
  });
};
