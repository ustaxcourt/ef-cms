import { post } from '@shared/proxies/requests';

export const logInInteractor = (
  applicationContext,
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
