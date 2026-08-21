import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const changePasswordInteractor = (
  applicationContext: ClientApplicationContext,
  {
    code,
    confirmPassword,
    email,
    password,
    tempPassword,
  }: {
    confirmPassword: string;
    password: string;
    email: string;
    tempPassword?: string;
    code?: string;
  },
): Promise<{ accessToken: string; idToken: string; refreshToken: string }> => {
  return post({
    applicationContext,
    body: { code, confirmPassword, email, password, tempPassword },
    endpoint: '/auth/change-password',
    options: {
      withCredentials: true,
    },
  });
};
