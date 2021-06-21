const { post } = require('../requests');

/**
 * trial session set for hearing on a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber of the case to add the trial session set for hearing
 * @param {string} providers.calendarNotes the calendarNotes to go onto the trial session set for hearing
 * @param {string} providers.trialSessionId the id of the trial session to set the calendar
 * @returns {Promise<*>} the promise of the api call
 */
exports.setForHearingInteractor = (
  applicationContext,
  { calendarNotes, docketNumber, trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      calendarNotes,
    },
    endpoint: `/trial-sessions/${trialSessionId}/set-hearing/${docketNumber}`,
  });
};
