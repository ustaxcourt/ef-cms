/**
 * Gets the value of a feature flag passed into the factory function
 * @param {object} providers.applicationContext the application context
 * @returns {Function} the name and value of the feature flag
 */
export const getFeatureFlagFactoryAction =
  featureFlagName =>
  async ({ applicationContext }: ActionProps) => {
    const featureFlagValue = await applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor(applicationContext, {
        featureFlag: featureFlagName,
      });

    return { [featureFlagName]: featureFlagValue };
  };
