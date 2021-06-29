const { Note } = require('../../entities/notes/Note');

/**
 * validateNote
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.note the note object
 * @returns {object} the errors or null
 */
exports.validateNoteInteractor = (applicationContext, { note }) => {
  const errors = new Note(note, {
    applicationContext,
  }).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
