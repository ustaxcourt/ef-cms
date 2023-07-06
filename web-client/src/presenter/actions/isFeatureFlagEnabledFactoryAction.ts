import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * Returns the yes path if the specified feature flag is enabled, otherwise
 * returns the no path with the disabled message.
 * @param {object} providers.path the cerebral path
 * @param {object} providers.props the cerebral props
 * @returns {object} yes or no path, depending on if feature flag is enabled
 */
export const isFeatureFlagEnabledFactoryAction =
  featureFlagObject =>
  async ({ applicationContext, get, path, store }: ActionProps) => {
    let featureFlags = get(state.featureFlags);

    if (isEmpty(featureFlags)) {
      featureFlags = await applicationContext
        .getUseCases()
        .getAllFeatureFlagsInteractor(applicationContext);

      store.set(state.featureFlags, featureFlags);
    }

    const featureFlagIsEnabled = featureFlags[featureFlagObject.key];

    if (featureFlagIsEnabled) {
      return path.yes();
    }

    return path.no({
      alertWarning: {
        message: featureFlagObject.disabledMessage,
      },
    });
  };
