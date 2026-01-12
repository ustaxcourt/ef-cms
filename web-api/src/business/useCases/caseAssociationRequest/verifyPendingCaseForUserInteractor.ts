import { verifyPendingCaseForUser } from '@web-api/persistence/postgres/cases/pendingCases/verifyPendingCaseForUser';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to verify
 * @param {string} providers.userId the user id to verify
 * @returns {Promise<*>} the promise of the pending case verification
 */
export const verifyPendingCaseForUserInteractor = async (
  { docketNumber, userId }: { docketNumber: string; userId: string },
) => {
  return await verifyPendingCaseForUser({
    docketNumber,
    userId,
  });
};
