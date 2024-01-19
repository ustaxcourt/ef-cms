import { ClientApplicationContext } from '@web-client/applicationContext';
import { ForgotPasswordResponse } from '@web-api/business/useCases/auth/forgotPasswordInteractor';
import { post } from '../requests';

export const forgotPasswordInteractor = (
  applicationContext: ClientApplicationContext,
  {
    email,
  }: {
    email: string;
  },
): Promise<ForgotPasswordResponse> => {
  return post({
    applicationContext,
    body: { email },
    endpoint: '/auth/forgot-password',
  });
};
