import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const isOrderSearchEnabled = get(state.isOrderSearchEnabled);
  const isSearchEnabled =
    isOrderSearchEnabled &&
    applicationContext.isFeatureEnabled('advanced_document_search');

  return { isSearchEnabled };
};
