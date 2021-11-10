import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const { role } = get(state.user);
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  const isUserInternal = applicationContext.getUtilities().isInternalUser(role);
  const isInternalOrderSearchEnabled = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key],
  );
  const isInternalOpinionSearchEnabled = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key],
  );

  let isOrderSearchEnabledForRole = false;
  if (role && isUserInternal) {
    isOrderSearchEnabledForRole = isInternalOrderSearchEnabled;
  } else {
    isOrderSearchEnabledForRole = get(
      state.featureFlags[ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key],
    );
  }

  return {
    isInternalOpinionSearchEnabled,
    isOrderSearchEnabledForRole,
  };
};
