import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const changePasswordInteractor = (
  applicationContext: ClientApplicationContext,
  {
    confirmPassword,
    password,
    tempPassword,
    userEmail,
  }: {
    confirmPassword: string;
    password: string;
    userEmail: string;
    tempPassword: string;
  },
): Promise<{ accessToken: string; idToken: string; refreshToken: string }> => {
  return post({
    applicationContext,
    body: { confirmPassword, password, tempPassword, userEmail },
    endpoint: '/auth/change-password',
    options: {
      withCredentials: false,
    },
  });
};
