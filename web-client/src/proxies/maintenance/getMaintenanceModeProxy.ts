import { get } from '../requests';

export const getMaintenanceModeInteractor = (
  applicationContext,
): Promise<{
  maintenanceMode: boolean;
  readOnlyMode: boolean;
}> => {
  return get({
    applicationContext,
    endpoint: '/system/maintenance-mode',
  });
};
