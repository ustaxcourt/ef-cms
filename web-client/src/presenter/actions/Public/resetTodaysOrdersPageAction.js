import { state } from 'cerebral';
/**
 * resets the state.todaysOrders.page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store object
 */
export const resetTodaysOrdersPageAction = ({ store }) => {
  store.unset(state.todaysOrders.page);
};
