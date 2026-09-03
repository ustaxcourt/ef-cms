import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const authCodeInteractor = (
  applicationContext: ClientApplicationContext,
  authCode: string,
): Promise<{ accessToken: string; idToken: string; refreshToken: string }> => {
  return post({
    applicationContext,
    body: {
      authCode,
    },
    endpoint: '/auth/code',
    options: {
      withCredentials: true,
    },
  });
};
