import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { asyncSyncHandler, put } from '../requests';

/**
 * updateCaseDeadlineInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseDeadline the case deadline data
 * @returns {Promise<*>} the promise of the api call
 */
export const updateCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadline },
): Promise<RawCaseDeadline> => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        body: { caseDeadline },
        asyncSyncId,
        endpoint: `/async/case-deadlines/${caseDeadline.docketNumber}/${caseDeadline.caseDeadlineId}`,
      }),
  ) as Promise<RawCaseDeadline>;
};
