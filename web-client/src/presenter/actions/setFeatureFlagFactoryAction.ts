import { state } from 'cerebral';

/**
 * Sets the value of a feature flag passed into the factory function
 * @param {object} featureFlagName the application context
 * @returns {Function} sets feature flag value on state
 */
export const setFeatureFlagFactoryAction =
  featureFlagName =>
  ({ props, store }: ActionProps) => {
    const featureFlagValue = props[featureFlagName];

    store.set(state.featureFlags[featureFlagName], featureFlagValue);
  };
