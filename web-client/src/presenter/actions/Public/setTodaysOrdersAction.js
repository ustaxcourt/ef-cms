import { state } from 'cerebral';
/**
 * sets the state.todaysOrders based on props.todaysOrders
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const setTodaysOrdersAction = async ({ props, store }) => {
  store.set(state.todaysOrders, props.todaysOrders);
};
