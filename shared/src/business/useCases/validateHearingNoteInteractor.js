const { HearingNote } = require('../entities/notes/HearingNote');

/**
 * validateHearingNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.note the note string
 * @returns {object} the errors or null
 */
exports.validateHearingNoteInteractor = ({ applicationContext, note }) => {
  const errors = new HearingNote(
    { note },
    {
      applicationContext,
    },
  ).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
