const { OpinionSearch } = require('../entities/opinions/OpinionSearch');

/**
 * validateOpinionAdvancedSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.opinionSearch the opinion search to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateOpinionAdvancedSearchInteractor = ({
  applicationContext,
  opinionSearch,
}) => {
  const search = new OpinionSearch(opinionSearch, {
    applicationContext,
  });

  return search.getFormattedValidationErrors();
};
