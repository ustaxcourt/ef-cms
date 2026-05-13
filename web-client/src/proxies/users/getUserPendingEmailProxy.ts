import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUserPendingEmailInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
): Promise<string | undefined> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/pending-email`,
  });
};
