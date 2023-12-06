/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} the value of maintenance mode
 */
export const getMaintenanceModeInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const start = Date.now();
  console.log('Start getMaintenanceModeInteractor');
  const result = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });
  console.log(
    `End getMaintenanceModeInteractor. Time: ${Date.now() - start}ms`,
  );
  return !!(result && result.current);
};
