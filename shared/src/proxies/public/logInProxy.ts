import { post } from '@shared/proxies/requests';

export const logInInteractor = (
  applicationContext,
  { email, password }: { email: string; password: string },
) => {
  return post({
    applicationContext,
    body: { email, password },
    endpoint: '/auth/login',
  });
};
