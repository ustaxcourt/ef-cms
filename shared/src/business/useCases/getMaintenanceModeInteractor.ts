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
  applicationContext.logger.info('Start getMaintenanceModeInteractor');
  const result = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });
  applicationContext.logger.info(
    `End getMaintenanceModeInteractor. Time: ${Date.now() - start}ms`,
  );
  return !!(result && result.current);
};
