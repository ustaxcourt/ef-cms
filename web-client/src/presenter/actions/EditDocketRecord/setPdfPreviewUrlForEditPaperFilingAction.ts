import { state } from 'cerebral';

/**
 * sets the pdfPreviewUrl for the attached document on the edit paper filing view
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setPdfPreviewUrlForEditPaperFilingAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { docketEntryId } = props;

  const caseDocument = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );

  if (caseDocument && caseDocument.isFileAttached) {
    const { url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
        key: docketEntryId,
      });

    store.set(state.pdfPreviewUrl, url);
    store.set(state.currentViewMetadata.documentUploadMode, 'preview');
  }
};
