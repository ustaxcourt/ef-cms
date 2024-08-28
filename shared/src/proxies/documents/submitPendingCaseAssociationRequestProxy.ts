import { put } from '../requests';

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the api call
 */
export const submitPendingCaseAssociationRequestInteractor = (
  applicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
) => {
  return put({
    applicationContext,
    endpoint: `/users/${userId}/case/${docketNumber}/pending`,
  });
};
