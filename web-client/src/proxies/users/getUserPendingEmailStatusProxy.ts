import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUserPendingEmailStatusInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/pending-email-status`,
  });
};
