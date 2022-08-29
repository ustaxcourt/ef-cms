const { Case } = require('../entities/cases/Case');
const { CaseQC } = require('../entities/cases/CaseQC');

/**
 * validateCaseDetailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDetail the case data to validate
 * @param {object} providers.useCaseEntity the flag indicating what kind of entity to use
 * @returns {object} errors (null if no errors)
 */
exports.validateCaseDetailInteractor = (
  applicationContext,
  { caseDetail, useCaseEntity = false },
) => {
  if (useCaseEntity) {
    return new Case(caseDetail, {
      applicationContext,
    }).getFormattedValidationErrors();
  }
  return new CaseQC(caseDetail, {
    applicationContext,
  }).getFormattedValidationErrors();
};
