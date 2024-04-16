import { asyncSyncHandler, post } from '../requests';

/**
 * appendAmendedPetitionFormProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the id of the docket entry to append the form to
 * @returns {Promise<*>} the promise of the api call
 */
export const appendAmendedPetitionFormInteractor = (
  applicationContext,
  { docketEntryId },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/case-documents/${docketEntryId}/append-pdf`,
      }),
  );
};
