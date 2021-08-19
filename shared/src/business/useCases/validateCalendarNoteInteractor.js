const { CalendarNote } = require('../entities/notes/CalendarNote');

/**
 * validateCalendarNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.note the note string
 * @returns {object} the errors or null
 */
exports.validateCalendarNoteInteractor = (applicationContext, { note }) => {
  const errors = new CalendarNote(
    { note },
    {
      applicationContext,
    },
  ).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
