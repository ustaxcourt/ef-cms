import { state } from '@web-client/presenter/app-public.cerebral';
/**
 * sets the state.todaysOrders based on props.todaysOrders
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the state get function
 * @param {object} providers.props the props object
 * @param {object} providers.store the store object
 */
export const setTodaysOrdersAction = ({ props, store }: ActionProps) => {
  store.set(state.todaysOrders.results, props.todaysOrders);
  store.set(state.todaysOrders.totalCount, props.totalCount);
};
