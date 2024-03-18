import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '@shared/proxies/requests';

export const logOldLoginAttemptInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<void> => {
  return get({
    applicationContext,
    endpoint: '/system/metrics/old-login',
  });
};
