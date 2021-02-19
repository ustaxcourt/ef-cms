const { put } = require('../requests');

/**
 * saveCalendarNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to add notes to
 * @param {string} providers.caseNote the notes to add
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveCalendarNoteInteractor = ({
  applicationContext,
  calendarNote,
  docketNumber,
  trialSessionId,
}) => {
  return put({
    applicationContext,
    body: { calendarNote, docketNumber },
    endpoint: `/trial-session/${trialSessionId}/set-calendar-note`,
  });
};
