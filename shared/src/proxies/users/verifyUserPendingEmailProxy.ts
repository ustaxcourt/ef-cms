import { put } from '../requests';

/**
 * verifyUserPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.token the pending email token
 * @returns {Promise<*>} the promise of the api call
 */
export const verifyUserPendingEmailInteractor = (
  applicationContext,
  { token },
) => {
  return put({
    applicationContext,
    body: {
      token,
    },
    endpoint: '/async/users/verify-email',
  });
};
