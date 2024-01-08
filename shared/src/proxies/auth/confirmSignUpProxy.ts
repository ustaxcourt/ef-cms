import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const confirmSignUpInteractor = (
  applicationContext: ClientApplicationContext,
  { confirmationCode, userId }: { confirmationCode: string; userId: string },
) => {
  return post({
    applicationContext,
    body: { confirmationCode, userId },
    endpoint: '/auth/confirm-signup',
    options: {
      withCredentials: false,
    },
  });
};
