const { put } = require('../requests');

/**
 * saveCalendarNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendarNote the note to update
 * @param {string} providers.docketNumber the docket number of the case to update calendar note
 * @param {string} providers.trialSessionId the id of the trial session containing the case with the note
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveCalendarNoteInteractor = (
  applicationContext,
  { calendarNote, docketNumber, trialSessionId },
) => {
  return put({
    applicationContext,
    body: { calendarNote, docketNumber },
    endpoint: `/trial-sessions/${trialSessionId}/set-calendar-note`,
  });
};
