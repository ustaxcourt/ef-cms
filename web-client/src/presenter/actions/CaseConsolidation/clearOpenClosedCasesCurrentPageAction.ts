import { state } from '@web-client/presenter/app.cerebral';

/**
 * Clears the openCases and closedCases current page values
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store]
 */
export const clearOpenClosedCasesCurrentPageAction = ({
  store,
}: ActionProps) => {
  store.unset(state.closedCasesCurrentPage);
  store.unset(state.openCasesCurrentPage);
};
