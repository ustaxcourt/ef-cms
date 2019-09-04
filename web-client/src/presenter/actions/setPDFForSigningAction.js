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

  if (caseDetail && Array.isArray(caseDetail.documents)) {
    const document = caseDetail.documents.find(
      caseDocument => caseDocument.documentId === documentId,
    );

    if (document && document.documentType === 'Proposed Stipulated Decision') {
      removeCover = true;
    }
  }

  let pdfObj = {};

  pdfObj = await applicationContext.getUseCases().loadPDFForSigningInteractor({
    applicationContext,
    documentId,
    removeCover,
  });

  store.set(state.pdfForSigning.pdfjsObj, pdfObj);
};
