import { ServerApplicationContext } from '@web-api/applicationContext';

export const getMaintenanceModeInteractor = async (
  applicationContext: ServerApplicationContext,
) => {
  const start = Date.now();
  applicationContext.logger.info('Start getMaintenanceModeInteractor');
  const result = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });
  applicationContext.logger.info(
    `End getMaintenanceModeInteractor. Time: ${Date.now() - start}ms`,
  );
  return result && result === 'true';
};
