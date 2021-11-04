import { state } from 'cerebral';

/**
 * Gets the value of a feature flag
 *
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object
 * @param {object} providers.store the cerebral store object
 * @returns {object} next path in sequence based on if order search is enabled or not
 */
export const getFeatureFlagValueAction = async ({
  applicationContext,
  path,
  store,
}) => {
  const featureFlagEnabled = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext);

  // todo: update this to an object that contains each feature flag name
  store.set(state.isInternalOrderSearchEnabled, featureFlagEnabled);

  if (featureFlagEnabled) {
    return path.yes();
  }

  // todo: pass in a message specific to which feature flag
  return path.no({
    alertWarning: {
      message:
        "Order search has been disabled. You'll be notified when it's back up.",
    },
  });
};
