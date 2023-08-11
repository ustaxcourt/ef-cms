import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const featureFlagHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  const areMultiDocketablePaperFilingsEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key
    ],
  );

  return {
    areMultiDocketablePaperFilingsEnabled,
  };
};
