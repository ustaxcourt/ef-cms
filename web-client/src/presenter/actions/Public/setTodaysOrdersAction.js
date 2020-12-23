import { state } from 'cerebral';
/**
 * sets the state.todaysOrders based on props.todaysOrders
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const setTodaysOrdersAction = async ({ get, props, store }) => {
  const currentResults = get(state.todaysOrders.results);
  store.set(state.todaysOrders.results, [
    ...currentResults,
    ...props.todaysOrders,
  ]);
  store.set(state.todaysOrders.totalCount, props.totalCount);

  const page = get(state.todaysOrders.page) || 1;
  store.set(state.todaysOrders.page, page + 1);
};
