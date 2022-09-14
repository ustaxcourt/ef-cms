/**
 *
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key to retrieve
 * @returns {object} the item
 */
export const getItemInteractor = (
  applicationContext: IApplicationContext,
  { key }: { key: string },
) => {
  return applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
