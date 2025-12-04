import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} the value of maintenance mode
 */
export const getMaintenanceModeInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const start = Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS));
  applicationContext.logger.info('Start getMaintenanceModeInteractor');
  const result = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode();
  const end = Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS));
  applicationContext.logger.info(
    `End getMaintenanceModeInteractor. Time: ${end - start}ms`,
  );
  return !!(result && result.current);
};
