import { asyncSyncHandler, post } from '../requests';

/**
 * createCaseDeadlineInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {Promise<*>} the promise of the api call
 */
export const createCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadline },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: { caseDeadline },
        endpoint: `/async/case-deadlines/${caseDeadline.docketNumber}`,
      }),
  );
};
