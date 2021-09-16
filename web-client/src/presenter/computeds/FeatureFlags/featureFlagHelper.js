import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const isOrderSearchEnabled = get(state.isOrderSearchEnabled);
  const isSearchEnabled =
    isOrderSearchEnabled &&
    applicationContext.isFeatureEnabled('advanced_document_search');

  const isOpinionSearchEnabled = applicationContext.isFeatureEnabled(
    'advanced_opinion_search',
  );

  return { isOpinionSearchEnabled, isSearchEnabled };
};
