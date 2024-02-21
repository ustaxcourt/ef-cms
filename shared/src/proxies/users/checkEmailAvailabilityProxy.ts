import { get } from '../requests';

export const checkEmailAvailabilityInteractor = (
  applicationContext: IApplicationContext,
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
