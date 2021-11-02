import { state } from 'cerebral';

/**
 * Determines if external order search is enabled
 *
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object
 * @param {object} providers.store the cerebral store object
 * @returns {object} next path in sequence based on if order search is enabled or not
 */
export const getExternalOrderSearchEnabledAction = async ({
  applicationContext,
  path,
  store,
}) => {
  const externalOrderSearchEnabled = await applicationContext
    .getUseCases()
    .getExternalOrderSearchEnabledInteractor(applicationContext);

  store.set(state.isExternalOrderSearchEnabled, externalOrderSearchEnabled);

  if (externalOrderSearchEnabled) {
    return path.yes();
  }

  return path.no({
    alertWarning: {
      message:
        "Order search has been disabled. You'll be notified when it's back up.",
    },
  });
};
