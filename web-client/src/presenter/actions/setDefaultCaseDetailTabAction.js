import { state } from 'cerebral';

/**
 * sets the caseDetailPage.informationTab to a default value if it is not already set.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.cases
 * @param {object} providers.get the cerebral get function used for getting state from store
 */
export const setDefaultCaseDetailTabAction = ({ get, store }) => {
  store.set(
    state.caseDetailPage.informationTab,
    get(state.caseDetailPage.informationTab) || 'docketRecord',
  );
};
