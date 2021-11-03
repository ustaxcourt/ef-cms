import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const { role } = get(state.user);

  const isUserInternal = applicationContext.getUtilities().isInternalUser(role);
  const isInternalOrderSearchEnabled = get(state.isInternalOrderSearchEnabled);

  let isOrderSearchEnabledForRole = false;
  if (role && isUserInternal) {
    isOrderSearchEnabledForRole = isInternalOrderSearchEnabled;
  } else {
    isOrderSearchEnabledForRole = get(state.isExternalOrderSearchEnabled);
  }

  const isOpinionSearchEnabled = applicationContext.isFeatureEnabled(
    'advanced_opinion_search',
  );

  return {
    isOpinionSearchEnabled,
    isOrderSearchEnabledForRole,
  };
};
