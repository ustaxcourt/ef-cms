import { state } from 'cerebral';

/**
 * Gets the value of a feature flag passed into the factory function
 * @param {object} providers.applicationContext the application context
 * @returns {Function} the name and value of the feature flag
 */
export const getAllFeatureFlagsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  let featureFlags = {};

  try {
    featureFlags = await applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor(applicationContext);
  } catch (e) {
    console.error(e);
  }

  store.set(state.featureFlags, featureFlags);
};
