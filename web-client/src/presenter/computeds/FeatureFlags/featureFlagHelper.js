import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const isOrderSearchEnabled = get(state.isOrderSearchEnabled);

  const { role } = get(state.user);
  const isSearchEnabled =
    isOrderSearchEnabled &&
    applicationContext.getUtilities().isInternalUser(role);

  const isOpinionSearchEnabled = applicationContext.isFeatureEnabled(
    'advanced_opinion_search',
  );

  return { isOpinionSearchEnabled, isSearchEnabled };
};
