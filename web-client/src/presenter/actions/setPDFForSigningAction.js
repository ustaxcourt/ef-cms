import { state } from 'cerebral';

/**
 * given a PDF document, returns a pdf.js object
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting loadPDFForSigning
 * @param {Function} providers.props used for getting documentId
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.pdfjsObj

 */
export const setPDFForSigningAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { caseDetail, documentId } = props;

  store.set(state.pdfForSigning.documentId, documentId);

  if (process.env.CI === 'true') {
    return;
  }

  let removeCover = false;

  let editingSignedStipulatedDecision = false;

  if (caseDetail && Array.isArray(caseDetail.documents)) {
    const document = caseDetail.documents.find(
      caseDocument => caseDocument.documentId === documentId,
    );

    if (document && document.documentType === 'Proposed Stipulated Decision') {
      removeCover = true;
    } else {
      editingSignedStipulatedDecision = true;
    }
  }

  let pdfObj = {};

  let documentIdToLoad = documentId;

  // if we are looking at a signed stipulated decision, we need to display the clear signature button
  if (editingSignedStipulatedDecision) {
    store.set(state.pdfForSigning.isPdfAlreadySigned, true);
  }

  pdfObj = await applicationContext.getUseCases().loadPDFForSigningInteractor({
    applicationContext,
    documentId: documentIdToLoad,
    removeCover,
  });

  store.set(state.pdfForSigning.pdfjsObj, pdfObj);
};
