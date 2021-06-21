/**
 *
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key to retrieve
 * @returns {object} the item
 */
exports.getItemInteractor = async (applicationContext, { key }) => {
  return await applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
