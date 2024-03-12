import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const confirmSignUpInteractor = (
  applicationContext: ClientApplicationContext,
  {
    confirmationCode,
    email,
    userId,
  }: { confirmationCode: string; userId: string; email: string },
) => {
  return post({
    applicationContext,
    body: { confirmationCode, email, userId },
    endpoint: '/auth/confirm-signup',
    options: {
      withCredentials: false,
    },
  });
};
