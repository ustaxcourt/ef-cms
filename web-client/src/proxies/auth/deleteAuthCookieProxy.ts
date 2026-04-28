import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteAuthCookieInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<void> => {
  return remove({
    applicationContext,
    endpoint: '/auth/login',
    options: {
      withCredentials: true,
    },
  });
};
