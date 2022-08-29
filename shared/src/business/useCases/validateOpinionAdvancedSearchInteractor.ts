const { DocumentSearch } = require('../entities/documents/DocumentSearch');

/**
 * validateOpinionAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.opinionSearch the opinion search to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateOpinionAdvancedSearchInteractor = (
  applicationContext,
  { opinionSearch },
) => {
  const search = new DocumentSearch(opinionSearch, {
    applicationContext,
  });

  return search.getFormattedValidationErrors();
};
