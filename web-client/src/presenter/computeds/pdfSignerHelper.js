import { state } from 'cerebral';

export const pdfSignerHelper = (get, applicationContext) => {
  const {
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  } = applicationContext.getConstants();
  const form = get(state.form);
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const pdfForSigning = get(state.pdfForSigning);
  const { isPdfAlreadySigned, signatureApplied, signatureData } = pdfForSigning;
  const caseDocument = caseDetail.documents.find(
    doc => doc.documentId === documentId,
  );

  const isPlaced = signatureData || isPdfAlreadySigned;

  const showSkipSignatureButton =
    !isPlaced &&
    caseDocument.eventCode !== PROPOSED_STIPULATED_DECISION_EVENT_CODE;

  const cursorClass =
    !signatureData && signatureApplied ? 'cursor-grabbing ' : 'cursor-grab ';
  const hideClass = signatureApplied && !isPdfAlreadySigned ? '' : 'hide';

  return {
    disableSaveAndSendButton:
      !isPlaced || (!form.section && !form.assigneeId && !form.message),
    disableSaveButton:
      (!signatureData && !isPdfAlreadySigned) ||
      form.section ||
      form.assigneeId ||
      form.message,
    isPlaced,
    showSkipSignatureButton,
    signatureClass: `${cursorClass} ${hideClass}`,
  };
};
