import { state } from 'cerebral';
/**
 * sets the state.todaysOrders based on props.todaysOrders
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the state get function
 * @param {object} providers.props the props object
 * @param {object} providers.store the store object
 */
export const setTodaysOrdersAction = ({ get, props, store }) => {
  const currentResults = get(state.todaysOrders.results);
  const page = get(state.todaysOrders.page) || 1;
  let orderResults;
  if (page === 1) {
    orderResults = props.todaysOrders;
  } else {
    orderResults = [...currentResults, ...props.todaysOrders];
  }
  store.set(state.todaysOrders.results, orderResults);
  store.set(state.todaysOrders.totalCount, props.totalCount);

  store.set(state.todaysOrders.page, page + 1);
};
