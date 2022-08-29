/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} the value of maintenance mode
 */
export const getMaintenanceModeInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const result = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });
  return !!(result && result.current);
};
