/**
 * validateCaseDeadlineInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {object} errors if there are any, otherwise null
 */
exports.validateCaseDeadlineInteractor = ({
  applicationContext,
  caseDeadline,
}) => {
  const errors = new (applicationContext.getEntityConstructors().CaseDeadline)(
    caseDeadline,
    { applicationContext },
  ).getFormattedValidationErrors();
  return errors || null;
};
