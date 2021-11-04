import { state } from 'cerebral';

/**
 * Gets the value of a feature flag
 *
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object
 * @param {object} providers.store the cerebral store object
 * @returns {object} next path in sequence based on if order search is enabled or not
 */
export const getFeatureFlagValueAction =
  featureFlagName =>
  async ({ applicationContext, path, store }) => {
    const { FEATURE_FLAG_DISABLED_MESSAGES } =
      applicationContext.getConstants();

    const featureFlagEnabled = await applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor(applicationContext);

    store.set(state.featureFlags[featureFlagName], featureFlagEnabled);

    if (featureFlagEnabled) {
      return path.yes();
    }

    return path.no({
      alertWarning: {
        message: FEATURE_FLAG_DISABLED_MESSAGES[featureFlagName],
      },
    });
  };
