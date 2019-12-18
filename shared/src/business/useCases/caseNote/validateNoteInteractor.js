/**
 * validateNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.note the note object
 * @returns {object} the errors or null
 */
exports.validateNoteInteractor = ({ applicationContext, note }) => {
  const errors = new (applicationContext.getEntityConstructors().Note)(
    note,
  ).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
