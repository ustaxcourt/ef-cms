import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

export const getMaintenanceModeInteractor = async (
  applicationContext: IApplicationContext,
): Promise<boolean> => {
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
