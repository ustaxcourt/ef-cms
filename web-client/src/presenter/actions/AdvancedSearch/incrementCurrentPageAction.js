import { state } from 'cerebral';

/**
 * increments state.form.currentPage by 1
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const incrementCurrentPageAction = ({ get, store }) => {
  const currentPage = get(state.form.currentPage) || 1;

  store.set(state.form.currentPage, currentPage + 1);
};
