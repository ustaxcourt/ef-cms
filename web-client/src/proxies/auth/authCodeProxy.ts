import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const authCodeInteractor = (
  applicationContext: ClientApplicationContext,
  authCode: string,
  code_verifier: string,
): Promise<{ accessToken: string; idToken: string; refreshToken: string }> => {
  return post({
    applicationContext,
    body: {
      authCode,
      code_verifier,
    },
    endpoint: '/auth/code',
    options: {
      withCredentials: true,
    },
  });
};
