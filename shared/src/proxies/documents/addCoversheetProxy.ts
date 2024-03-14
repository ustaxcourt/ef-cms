import { asyncSyncPost } from '../requests';

/**
 * addCoversheetInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.docketEntryId the docket entry id
 * @returns {Promise<*>} the promise of the api call
 */
export const addCoversheetInteractor = (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  return asyncSyncPost({
    applicationContext,
    endpoint: `/async/case-documents/${docketNumber}/${docketEntryId}/coversheet`,
  });
};
