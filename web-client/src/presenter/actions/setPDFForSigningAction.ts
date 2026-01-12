import { state } from '@web-client/presenter/app.cerebral';
import { PDFDocumentProxy } from 'pdfjs-dist';

/**
 * given a PDF document, returns a pdf.js object
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting loadPDFForSigning
 * @param {Function} providers.props used for getting docketEntryId
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.pdfjsObj
 */
export const setPDFForSigningAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { caseDetail, docketEntryId } = props;

  store.set(state.pdfForSigning.docketEntryId, docketEntryId);

  let removeCover = false;

  let editingSignedStipulatedDecision = false;

  if (caseDetail && Array.isArray(caseDetail.docketEntries)) {
    const document = caseDetail.docketEntries.find(
      caseDocument => caseDocument.docketEntryId === docketEntryId,
    );

    if (document && document.documentType === 'Proposed Stipulated Decision') {
      removeCover = true;
    } else {
      editingSignedStipulatedDecision = true;
    }
  }

  // if we are looking at a signed stipulated decision, we need to display the clear signature button
  if (editingSignedStipulatedDecision) {
    store.set(state.pdfForSigning.isPdfAlreadySigned, true);
  }

  const pdfObj: PDFDocumentProxy = await applicationContext
    .getUseCases()
    .loadPDFForSigningInteractor(applicationContext, {
      docketEntryId,
      docketNumber: caseDetail?.docketNumber,
      removeCover,
    });

  store.set(state.pdfForSigning.pdfjsObj, pdfObj);
};
