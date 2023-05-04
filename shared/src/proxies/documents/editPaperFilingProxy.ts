import { put } from '../requests';

/**
 * editPaperFilingProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.clientConnectionId the UUID of the websocket connection for the current tab
 * @param {Array} providers.consolidatedGroupDocketNumbers list of member cases to multi-docket paper filing on
 * @param {string} providers.docketEntryId the docket entry id
 * @param {object} providers.documentMetadata the document metadata
 * @param {Boolean} providers.isSavingForLater true if saving for later, false otherwise
 * @returns {Promise<*>} the promise of the api call
 */
export const editPaperFilingInteractor = (
  applicationContext,
  {
    clientConnectionId,
    consolidatedGroupDocketNumbers,
    docketEntryId,
    documentMetadata,
    isSavingForLater,
  },
) => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      clientConnectionId,
      consolidatedGroupDocketNumbers,
      docketEntryId,
      documentMetadata,
      isSavingForLater,
    },
    endpoint: `/async/case-documents/${docketNumber}/paper-filing`,
  });
};
