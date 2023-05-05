import { put } from '../requests';

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
) => {
  return put({
    applicationContext,
    body: { caseDeadline },
    endpoint: `/case-deadlines/${caseDeadline.docketNumber}/${caseDeadline.caseDeadlineId}`,
  });
};
