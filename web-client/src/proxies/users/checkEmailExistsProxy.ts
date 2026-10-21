import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const checkEmailExistsInteractor = (
  applicationContext: ClientApplicationContext,
  { email }: { email: string },
): Promise<boolean> => {
  return post({
    applicationContext,
    endpoint: '/users/email-practitioner-check',
    body: {
      email,
    },
  });
};
