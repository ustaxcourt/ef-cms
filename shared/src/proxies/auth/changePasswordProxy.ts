import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const changePasswordInteractor = (
  applicationContext: ClientApplicationContext,
  {
    confirmPassword,
    password,
    session,
    userEmail,
  }: {
    confirmPassword: string;
    password: string;
    userEmail: string;
    session: string;
  },
) => {
  return post({
    applicationContext,
    body: { confirmPassword, password, session, userEmail },
    endpoint: '/auth/change-password',
    options: {
      withCredentials: false,
    },
  });
};
