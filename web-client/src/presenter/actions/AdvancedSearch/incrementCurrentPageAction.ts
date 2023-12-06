import { state } from '@web-client/presenter/app.cerebral';

/**
 * increments state.advancedSearchForm.currentPage by 1
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const incrementCurrentPageAction = ({ get, store }: ActionProps) => {
  const currentPage = get(state.advancedSearchForm.currentPage) || 1;

  store.set(state.advancedSearchForm.currentPage, currentPage + 1);
};
