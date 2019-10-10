const { CaseSearch } = require('../entities/cases/CaseSearch');

/**
 * validateCaseSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.caseSearch the case search to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateCaseSearchInteractor = ({ applicationContext, caseSearch }) => {
  const search = new CaseSearch(caseSearch, {
    applicationContext,
  });
  return search.getFormattedValidationErrors();
};
