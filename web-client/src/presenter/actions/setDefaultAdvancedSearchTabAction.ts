import { state } from 'cerebral';

/**
 * sets the state.advancedSearchTab to ADVANCED_SEARCH_TABS.CASE
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const setDefaultAdvancedSearchTabAction = ({
  applicationContext,
  store,
}) => {
  const { ADVANCED_SEARCH_TABS } = applicationContext.getConstants();

  store.set(state.advancedSearchTab, ADVANCED_SEARCH_TABS.CASE);
};
