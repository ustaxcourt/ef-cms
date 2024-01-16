import { LoginInteractorResponse } from '@web-api/business/useCases/auth/loginInteractor';
import { post } from '@shared/proxies/requests';

export const loginInteractor = (
  applicationContext,
  { email, password }: { email: string; password: string },
): Promise<LoginInteractorResponse> => {
  return post({
    applicationContext,
    body: { email, password },
    endpoint: '/auth/login',
    options: {
      withCredentials: true,
    },
  });
};
