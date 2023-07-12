/**
 * Returns the yes path if the specified feature flag is enabled, otherwise
 * returns the no path with the disabled message.
 * @param {object} providers.path the cerebral path
 * @param {object} providers.props the cerebral props
 * @returns {object} yes or no path, depending on if feature flag is enabled
 */
export const isFeatureFlagEnabledFactoryAction =
  featureFlagObject =>
  ({ path, props }: ActionProps) => {
    const featureFlagIsEnabled = props[featureFlagObject.key];

    if (featureFlagIsEnabled) {
      return path.yes();
    }

    return path.no({
      alertWarning: {
        message: featureFlagObject.disabledMessage,
      },
    });
  };
