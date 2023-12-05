import { state } from '@web-client/presenter/app-public.cerebral';
/**
 * resets the state.todaysOrders.page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store object
 */
export const resetTodaysOrdersPageAction = ({ store }: ActionProps) => {
  store.unset(state.todaysOrders.page);
};
