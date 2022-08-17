const { Case } = require('../entities/cases/Case');
const { CaseQC } = require('../entities/cases/CaseQC');

/**
 * validateCaseDetailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDetail the case data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateCaseDetailInteractor = (
  applicationContext,
  { caseDetail, isCaseExternal = false },
) => {
  if (isCaseExternal) {
    return new Case(caseDetail, {
      applicationContext,
    }).getFormattedValidationErrors();
  }
  return new CaseQC(caseDetail, {
    applicationContext,
  }).getFormattedValidationErrors();
};
