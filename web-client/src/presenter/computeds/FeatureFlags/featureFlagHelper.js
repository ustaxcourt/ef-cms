export const featureFlagHelper = (get, applicationContext) => {
  const isSearchEnabled = applicationContext.isFeatureEnabled(
    'advanced_document_search',
  );
  return { isSearchEnabled };
};
