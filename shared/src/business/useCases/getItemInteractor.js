/**
 *
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key to retrieve
 * @returns {object} the item
 */
exports.getItemInteractor = (applicationContext, { key }) => {
  return applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
