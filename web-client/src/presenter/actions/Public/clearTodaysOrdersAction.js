import { state } from 'cerebral';

/**
 * sets the state.todaysOrders based on props.todaysOrders
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const clearTodaysOrdersAction = async ({ store }) => {
  store.set(state.todaysOrders, { results: [] });
};
