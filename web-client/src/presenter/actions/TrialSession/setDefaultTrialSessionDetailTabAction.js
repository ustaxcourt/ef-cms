import { state } from 'cerebral';
/**
 * @param { object } providers.store the cerebral store used for setting the state.cases
 * @param { object } providers.get the cerebral get function used for getting state from store
 */

export const setDefaultTrialSessionDetailTabAction = ({ store }) => {
  store.unset(state.trialSessionDetailsTab.calendaredCaseList);
};
