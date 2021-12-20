import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const { role } = get(state.user);
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  const isUserInternal = applicationContext.getUtilities().isInternalUser(role);

  const isPdfJsEnabled = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.PDFJS_EXPRESS_VIEWER.key],
  );

  let isOrderSearchEnabledForRole = false;
  if (role && isUserInternal) {
    const isInternalOrderSearchEnabled = get(
      state.featureFlags[ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key],
    );
    isOrderSearchEnabledForRole = isInternalOrderSearchEnabled;
  } else {
    isOrderSearchEnabledForRole = get(
      state.featureFlags[ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key],
    );
  }

  let isOpinionSearchEnabledForRole = false;
  if (role && isUserInternal) {
    const isInternalOpinionSearchEnabled = get(
      state.featureFlags[ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key],
    );
    isOpinionSearchEnabledForRole = isInternalOpinionSearchEnabled;
  } else {
    isOpinionSearchEnabledForRole = get(
      state.featureFlags[ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key],
    );
  }

  return {
    isOpinionSearchEnabledForRole,
    isOrderSearchEnabledForRole,
    isPdfJsEnabled,
  };
};
