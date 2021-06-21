import { state } from 'cerebral';

/**
 * calls the proxy/interactor to archive a document on the backend
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 * @returns {Promise} async action
 */
export const archiveDraftDocumentAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const { docketEntryId, redirectToCaseDetail } = get(
    state.archiveDraftDocument,
  );
  const docketNumber = get(state.caseDetail.docketNumber);

  const updatedCase = await applicationContext
    .getUseCases()
    .archiveDraftDocumentInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  store.unset(state.viewerDraftDocumentToDisplay);
  store.unset(state.draftDocumentViewerDocketEntryId);

  store.set(state.alertSuccess, {
    message: 'Document deleted.',
  });

  if (redirectToCaseDetail) {
    store.set(state.saveAlertsForNavigation, true);

    return {
      caseDetail: updatedCase,
      docketNumber,
    };
  }

  return { caseDetail: updatedCase };
};
