import { state } from 'cerebral';

/**
 * Clears the openCases and closedCases current page values
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store]
 */
export const clearOpenClosedCasesCurrentPageAction = async ({ store }) => {
  store.unset(state.closedCasesCurrentPage);
  store.unset(state.openCasesCurrentPage);
};
