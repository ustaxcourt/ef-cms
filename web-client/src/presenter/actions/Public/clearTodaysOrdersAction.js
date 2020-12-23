import { state } from 'cerebral';

/**
 * clears the state.todaysOrders and sets results to an empty array
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const clearTodaysOrdersAction = async ({ store }) => {
  store.set(state.todaysOrders, { results: [] });
};
