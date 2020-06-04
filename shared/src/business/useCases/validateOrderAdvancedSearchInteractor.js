const { DocumentSearch } = require('../entities/documents/DocumentSearch');

/**
 * validateOrderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.orderSearch the order search to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateOrderAdvancedSearchInteractor = ({
  applicationContext,
  orderSearch,
}) => {
  const search = new DocumentSearch(orderSearch, {
    applicationContext,
  });

  return search.getFormattedValidationErrors();
};
