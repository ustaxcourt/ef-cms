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
  const { OrderSearch } = applicationContext.getEntityConstructors();
  const search = new OrderSearch(orderSearch, {
    applicationContext,
  });
  return search.getFormattedValidationErrors();
};
