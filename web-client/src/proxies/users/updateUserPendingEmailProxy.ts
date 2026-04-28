import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateUserPendingEmailInteractor = (
  applicationContext: ClientApplicationContext,
  { pendingEmail },
) => {
  return put({
    applicationContext,
    body: {
      pendingEmail,
    },
    endpoint: '/users/pending-email',
  });
};
