import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const confirmSignUpInteractor = (
  applicationContext: ClientApplicationContext,
  {
    confirmationCode,
    userEmail,
  }: { confirmationCode: string; userEmail: string },
) => {
  return post({
    applicationContext,
    body: { confirmationCode, userEmail },
    endpoint: '/confirm-signup',
    options: {
      withCredentials: false,
    },
  });
};
