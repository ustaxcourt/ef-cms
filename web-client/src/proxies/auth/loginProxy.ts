import { post } from '@web-client/proxies/requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const loginInteractor = (
  applicationContext: ClientApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}> => {
  return post({
    applicationContext,
    body: { email, password },
    endpoint: '/auth/login',
    options: {
      withCredentials: true,
    },
  });
};
