import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export const checkEmailAvailabilityInteractor = (
  applicationContext: ClientApplicationContext,
  { email }: { email: string },
): Promise<{ isAccountUnverified: boolean; isEmailAvailable: boolean }> => {
  return get({
    applicationContext,
    endpoint: '/users/email-availability',
    params: {
      email,
    },
  });
};
