import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export type MaintenanceModeResponse = {
  maintenanceMode: boolean;
  readOnlyMode: boolean;
};

export const getMaintenanceModeInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<MaintenanceModeResponse> => {
  return get({
    applicationContext,
    endpoint: '/system/maintenance-mode',
  });
};
