import { put } from '../requests';

/**
 * unsealDocketEntryInteractor proxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketEntryId the docketEntryId to be unsealed
 * @param {object} providers.docketNumber the docket number for the case
 * @returns {Promise<*>} the promise of the api call
 */
export const unsealDocketEntryInteractor = (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  return put({
    applicationContext,
    body: {
      docketEntryId,
      docketNumber,
    },
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/unseal`,
  });
};
