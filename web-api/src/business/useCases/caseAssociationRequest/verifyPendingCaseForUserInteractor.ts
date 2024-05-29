import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to verify
 * @param {string} providers.userId the user id to verify
 * @returns {Promise<*>} the promise of the pending case verification
 */
export const verifyPendingCaseForUserInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
) => {
  return await applicationContext
    .getPersistenceGateway()
    .verifyPendingCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
};
