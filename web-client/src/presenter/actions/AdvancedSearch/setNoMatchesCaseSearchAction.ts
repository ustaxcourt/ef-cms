import { state } from 'cerebral';

/*
 * sets state.searchResults for case search to an empty array to display no matches found message
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const setNoMatchesCaseSearchAction = ({ applicationContext, store }) => {
  const { ADVANCED_SEARCH_TABS } = applicationContext.getConstants();
  store.set(state.searchResults[ADVANCED_SEARCH_TABS.CASE], []);
};
