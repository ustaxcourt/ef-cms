import { state } from '@web-client/presenter/app.cerebral';

/**
 * increments state.openCasesCurrentPage by 1
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const incrementCurrentPageOpenCasesAction = ({
  get,
  store,
}: ActionProps) => {
  const currentPage = get(state.openCasesCurrentPage) || 1;

  store.set(state.openCasesCurrentPage, currentPage + 1);
};
