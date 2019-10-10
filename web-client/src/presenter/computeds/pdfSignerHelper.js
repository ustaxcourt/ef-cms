import { state } from 'cerebral';

export const pdfSignerHelper = get => {
  const form = get(state.form);
  const signatureData = get(state.pdfForSigning.signatureData);
  const isPdfAlreadySigned = get(state.pdfForSigning.isPdfAlreadySigned);
  const signatureApplied = get(state.pdfForSigning.signatureApplied);

  const cursorClass =
    !signatureData && signatureApplied ? 'cursor-grabbing ' : 'cursor-grab ';
  const hideClass = signatureApplied && !isPdfAlreadySigned ? '' : 'hide';

  return {
    disableSaveAndSendButton:
      (!signatureData && !isPdfAlreadySigned) ||
      (!form.section && !form.assigneeId && !form.message),
    disableSaveButton:
      (!signatureData && !isPdfAlreadySigned) ||
      form.section ||
      form.assigneeId ||
      form.message,
    signatureClass: `${cursorClass} ${hideClass}`,
  };
};
