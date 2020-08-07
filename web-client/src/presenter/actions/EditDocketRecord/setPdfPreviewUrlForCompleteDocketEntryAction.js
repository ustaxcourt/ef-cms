import { state } from 'cerebral';

/**
 * sets the pdfPreviewUrl for the attached document on the complete docket entry view
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setPdfPreviewUrlForCompleteDocketEntryAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { documentId } = props;

  const caseDocument = caseDetail.documents.find(
    entry => entry.documentId === documentId,
  );

  if (caseDocument && caseDocument.isFileAttached) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        documentId,
      });

    store.set(state.pdfPreviewUrl, url);
    store.set(state.currentViewMetadata.documentUploadMode, 'preview');
  }
};
