import { post } from '../requests';

/**
 * updateCounselOnCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {object} providers.userData the user data to update
 * @param {string} providers.userId the id of the user to update
 * @returns {Promise<*>} the promise of the api call
 */
export const generateEntryOfAppearancePdfInteractor = (
  applicationContext,
  { docketNumber, filers, petitioners },
) => {
  return post({
    applicationContext,
    body: { filers, petitioners },
    endpoint: `/cases/${docketNumber}/generate-entry-of-appearance`,
  });
};
