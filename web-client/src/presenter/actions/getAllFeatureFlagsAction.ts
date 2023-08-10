import { state } from 'cerebral';

/**
 * Gets the value of all feature flags used in the system and sets them on state
 * @param {object} providers.applicationContext the application context
 */
export const getAllFeatureFlagsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  let featureFlags = {};

  try {
    featureFlags = await applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor(applicationContext);
  } catch (e) {
    console.error(e);
  }

  store.set(state.featureFlags, featureFlags);
};
