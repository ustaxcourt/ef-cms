import { updateSsmParameter } from '@web-api/persistence/ssmClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * updateMaintenanceMode
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {boolean} providers.maintenanceMode true to turn maintenance mode on, false otherwise
 */

export const updateMaintenanceMode = ({
  applicationContext,
  maintenanceMode,
}: {
  applicationContext: ServerApplicationContext;
  maintenanceMode: boolean;
}) =>
  updateSsmParameter({
    applicationContext,
    parameterName: 'maintenance-mode',
    value: maintenanceMode.toString(),
  });
