import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const forgotPasswordInteractor = (
  applicationContext: ClientApplicationContext,
  {
    email,
  }: {
    email: string;
  },
): Promise<{ bad: string }> => {
  return post({
    applicationContext,
    body: { email },
    endpoint: '/auth/forgot-password',
  });
};
