import { state } from 'cerebral';

/**
 * sets the entries in state.currentViewMetadata.caseDetail.caseDetailInternalTabs to true or false based on the state.currentViewMetadata.caseDetail.primaryTab
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the  state.currentViewMetadata.caseDetailInternalTabs
 * @param {object} providers.get the cerebral get function used for getting state from store
 */
export const setIsPrimaryTabAction = ({ get, store }) => {
  const primaryTab = get(state.currentViewMetadata.caseDetail.primaryTab);
  const caseDetailInternalTabs = get(
    state.currentViewMetadata.caseDetail.caseDetailInternalTabs,
  );

  Object.keys(caseDetailInternalTabs).map(tabName =>
    store.set(
      state.currentViewMetadata.caseDetail.caseDetailInternalTabs[tabName],
      primaryTab === tabName,
    ),
  );
};
