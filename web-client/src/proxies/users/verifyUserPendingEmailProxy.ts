import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const verifyUserPendingEmailInteractor = (
  applicationContext: ClientApplicationContext,
  { token }: { token: string },
): Promise<void> => {
  return put({
    applicationContext,
    body: {
      token,
    },
    endpoint: '/users/verify-email',
  });
};
