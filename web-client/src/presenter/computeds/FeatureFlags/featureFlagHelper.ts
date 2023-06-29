import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const featureFlagHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { role } = get(state.user);
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  const isUserInternal = applicationContext.getUtilities().isInternalUser(role);

  const areMultiDocketablePaperFilingsEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key
    ],
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
    areMultiDocketablePaperFilingsEnabled,
    isOpinionSearchEnabledForRole,
    isOrderSearchEnabledForRole,
  };
};
