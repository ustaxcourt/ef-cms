import { state } from 'cerebral';

/**
 * Determines if internal order search is enabled
 *
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object
 * @param {object} providers.store the cerebral store object
 * @returns {object} next path in sequence based on if order search is enabled or not
 */
export const getInternalOrderSearchEnabledAction = async ({
  applicationContext,
  path,
  store,
}) => {
  const orderSearchEnabled = await applicationContext
    .getUseCases()
    .getInternalOrderSearchEnabledInteractor(applicationContext);

  store.set(state.isInternalOrderSearchEnabled, orderSearchEnabled);

  if (orderSearchEnabled) {
    return path.yes();
  }

  return path.no({
    alertWarning: {
      message:
        "Order search has been disabled. You'll be notified when it's back up.",
    },
  });
};
