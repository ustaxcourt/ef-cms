import { put } from '../requests';

/**
 * updatePractitionerUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.barNumber the barNumber of the user to update
 * @param {object} providers.user the user data
 * @returns {Promise<object>} the updated user data
 */
export const updatePractitionerUserInteractor = (
  applicationContext,
  {
    barNumber,
    user,
    clientConnectionId,
  }: { barNumber: string; user: any; clientConnectionId: string },
) => {
  return put({
    applicationContext,
    body: { user, clientConnectionId },
    endpoint: `/async/practitioners/${barNumber}`,
  });
};
