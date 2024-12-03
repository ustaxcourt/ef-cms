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
  { clientConnectionId, token }: { clientConnectionId: string; token: string },
): Promise<void> => {
  return put({
    applicationContext,
    body: {
      clientConnectionId,
      token,
    },
    endpoint: '/async/users/verify-email',
  });
};
