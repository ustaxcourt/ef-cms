import { getResponse } from '../requests';

export const getMaintenanceModePublicInteractor = applicationContext =>
  getResponse({
    applicationContext,
    endpoint: '/public-api/maintenance-mode',
  });
