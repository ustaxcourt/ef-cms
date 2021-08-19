const { CaseDeadline } = require('../../entities/CaseDeadline');

/**
 * validateCaseDeadlineInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {object} errors if there are any, otherwise null
 */
exports.validateCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadline },
) => {
  const errors = new CaseDeadline(caseDeadline, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
