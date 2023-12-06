import { put } from './requests';

/**
 * saveCaseDetailInternalEditInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {Promise<*>} the promise of the api call
 */
export const saveCaseDetailInternalEditInteractor = (
  applicationContext,
  { caseToUpdate },
) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.docketNumber}`,
  });
};
