import { get } from '../requests';

export const getMaintenanceModeInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/system/maintenance-mode',
  });
};
