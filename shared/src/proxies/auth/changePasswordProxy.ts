import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const changePasswordInteractor = (
  applicationContext: ClientApplicationContext,
  {
    code,
    confirmPassword,
    password,
    tempPassword,
    userEmail,
  }: {
    confirmPassword: string;
    password: string;
    userEmail: string;
    tempPassword?: string;
    code?: string;
  },
): Promise<{ accessToken: string; idToken: string; refreshToken: string }> => {
  return post({
    applicationContext,
    body: { code, confirmPassword, password, tempPassword, userEmail },
    endpoint: '/auth/change-password',
    options: {
      withCredentials: true,
    },
  });
};
