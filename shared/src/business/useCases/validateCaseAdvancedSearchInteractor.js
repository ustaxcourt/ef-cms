const { CaseSearch } = require('../entities/cases/CaseSearch');

/**
 * validateCaseAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseSearch the case search to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateCaseAdvancedSearchInteractor = (
  applicationContext,
  { caseSearch },
) => {
  const search = new CaseSearch(caseSearch, {
    applicationContext,
  });
  return search.getFormattedValidationErrors();
};
