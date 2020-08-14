import { state } from 'cerebral';

/**
 * calls the proxy/interactor to delete a document on the backend
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the delete deleteDocumentInteractor we will need from the getUseCases method
 * @param {object} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 * @returns {Promise} async action
 */
export const deleteDraftDocumentAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const { documentId, redirectToCaseDetail } = get(state.archiveDraftDocument);
  const docketNumber = get(state.caseDetail.docketNumber);

  const updatedCase = await applicationContext
    .getUseCases()
    .deleteDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId,
    });

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

  return {
    caseDetail: updatedCase,
  };
};
