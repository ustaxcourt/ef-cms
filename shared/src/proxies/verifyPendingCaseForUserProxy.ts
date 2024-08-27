import { get } from './requests';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to verify
 * @param {string} providers.userId the user id to verify
 * @returns {Promise<*>} the promise of the api call
 */
export const verifyPendingCaseForUserInteractor = (
  applicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/case/${docketNumber}/pending`,
  });
};
