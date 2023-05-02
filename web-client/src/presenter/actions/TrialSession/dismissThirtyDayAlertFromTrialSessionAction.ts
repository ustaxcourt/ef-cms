import { state } from 'cerebral';
/**
 * sets the state.screenMetadata.showNewTab depending on the user role
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.query
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.trialSessionFilters
 */
export const dismissThirtyDayAlertFromTrialSessionAction = ({ get, store }) => {
  const { trialSessionId } = get(state.formattedTrialSessionDetails);
  const listOfBanners = get(state.listOfBanners) || [];
  listOfBanners.push({ dismissed: true, trialSessionId });

  store.set(listOfBanners, listOfBanners);
};
