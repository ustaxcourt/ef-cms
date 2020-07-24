import { state } from 'cerebral';

/**
 * given a PDF document, returns a pdf.js object
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting loadPDFForSigning
 * @param {Function} providers.props used for getting documentId
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.pdfjsObj
 */
export const loadOriginalProposedStipulatedDecisionAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const caseDetail = get(state.caseDetail);

  if (caseDetail && Array.isArray(caseDetail.documents)) {
    const document = caseDetail.documents.find(
      caseDocument =>
        caseDocument.documentType === 'Proposed Stipulated Decision',
    );

    const { documentId } = document;

    const pdfObj = await applicationContext
      .getUseCases()
      .loadPDFForSigningInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        documentId,
        removeCover: true,
      });
    store.set(state.pdfForSigning.pdfjsObj, pdfObj);
  }
};
