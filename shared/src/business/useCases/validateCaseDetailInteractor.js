const { CaseInternal } = require('../entities/cases/CaseInternal');

/**
 * validateCaseDetailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.caseDetail the case data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateCaseDetailInteractor = ({ applicationContext, caseDetail }) => {
  return new CaseInternal(caseDetail, {
    applicationContext,
  }).getFormattedValidationErrors();
};
