import { put } from '../requests';

/**
 * sealDocketEntryInteractor proxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketEntryId the docketEntryId to be sealed
 * @param {object} providers.docketEntrySealedTo who to seal the docket entry from
 * @param {object} providers.docketNumber the docket number for a case
 * @returns {Promise<*>} the promise of the api call
 */
export const sealDocketEntryInteractor = (
  applicationContext,
  { docketEntryId, docketEntrySealedTo, docketNumber },
) => {
  return put({
    applicationContext,
    body: {
      docketEntryId,
      docketEntrySealedTo,
      docketNumber,
    },
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/seal`,
  });
};
