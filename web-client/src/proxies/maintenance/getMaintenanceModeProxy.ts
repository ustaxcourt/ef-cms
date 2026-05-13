import { get } from '../requests';

export const getMaintenanceModeInteractor = (
  applicationContext,
): Promise<boolean> => {
  return get({
    applicationContext,
    endpoint: '/system/maintenance-mode',
  });
};
