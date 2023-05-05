import { get } from '../requests';

/**
 * checkEmailAvailabilityInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.email the email to check
 * @returns {Promise<*>} the promise of the api call
 */
export const checkEmailAvailabilityInteractor = (
  applicationContext,
  { email },
) => {
  return get({
    applicationContext,
    endpoint: '/users/email-availability',
    params: {
      email,
    },
  });
};
