/**
 * validateCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseNote the case note object
 * @returns {object} the errors or null
 */
exports.validateCaseNoteInteractor = ({ applicationContext, caseNote }) => {
  const errors = new (applicationContext.getEntityConstructors()).CaseNote(
    caseNote,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};
