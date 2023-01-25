/**
 * Gets the value of a feature flag passed into the factory function
 *
 * @param {object} providers.applicationContext the application context
 * @returns {object} the name and value of the feature flag
 */
export const getFeatureFlagFactoryAction =
  featureFlagNameConfig =>
  async ({ applicationContext }) => {
    const isFeatureFlagEnabled = await applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor(applicationContext, {
        featureFlag: featureFlagNameConfig.key,
      });

    return { [featureFlagNameConfig.key]: isFeatureFlagEnabled };
  };
