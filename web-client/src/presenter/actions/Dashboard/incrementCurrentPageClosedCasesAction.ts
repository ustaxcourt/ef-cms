import { state } from 'cerebral';

/**
 * increments state.closedCasesCurrentPage by 1
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const incrementCurrentPageClosedCasesAction = ({ get, store }) => {
  const currentPage = get(state.closedCasesCurrentPage) || 1;

  store.set(state.closedCasesCurrentPage, currentPage + 1);
};
