import { genericHandler } from '../../genericHandler';
import { getMaintenanceModeInteractor } from '@shared/business/useCases/getMaintenanceModeInteractor';

export const getMaintenanceModeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const maintenanceMode = await getMaintenanceModeInteractor(applicationContext);

      return {
        maintenanceMode,
        readOnlyMode: process.env.READ_ONLY_MODE === 'true',
      };
    },
    { bypassMaintenanceCheck: true },
  );
