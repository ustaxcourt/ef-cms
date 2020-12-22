/**
 * gets today's orders
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {Promise} a list of today's order documents
 */
export const getTodaysOrdersAction = async ({ applicationContext }) => {
  const todaysOrders = await applicationContext
    .getUseCases()
    .getTodaysOrdersInteractor({ applicationContext });

  return { todaysOrders };
};
