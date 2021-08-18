/**
 * Determines if order search is enabled
 *
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object
 * @returns {object} next path in sequence based on if order search is enabled or not
 */
export const getOrderSearchEnabledAction = async ({
  applicationContext,
  path,
}) => {
  const orderSearchEnabled = await applicationContext
    .getUseCases()
    .getOrderSearchEnabledInteractor(applicationContext);

  if (orderSearchEnabled) {
    return path.yes();
  }
  return path.no();
};
