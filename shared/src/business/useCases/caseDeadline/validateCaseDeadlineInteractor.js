/**
 * validateCaseDeadlineInteractor
 *
 * @param applicationContext
 * @param caseDeadline
 * @returns {object}
 */
exports.validateCaseDeadlineInteractor = ({
  applicationContext,
  caseDeadline,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).CaseDeadline(
    caseDeadline,
  ).getFormattedValidationErrors();
  return errors || null;
};
