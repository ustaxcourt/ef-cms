import { state } from 'cerebral';

/**
 * gets today's orders
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {Promise} a list of today's order documents
 */
export const getTodaysOrdersAction = async ({ applicationContext, get }) => {
  const page = get(state.todaysOrders.page) || 1;

  const {
    results,
    totalCount,
  } = await applicationContext
    .getUseCases()
    .getTodaysOrdersInteractor({ applicationContext, page });

  return { todaysOrders: results, totalCount };
};
