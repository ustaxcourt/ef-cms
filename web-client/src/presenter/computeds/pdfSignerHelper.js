import { state } from 'cerebral';

export const pdfSignerHelper = get => {
  const form = get(state.form);
  const signatureData = get(state.pdfForSigning.signatureData);
  const isPdfAlreadySigned = get(state.pdfForSigning.isPdfAlreadySigned);

  return {
    disableSaveAndSendButton:
      (!signatureData && !isPdfAlreadySigned) ||
      (!form.section && !form.assigneeId && !form.message),
    disableSaveButton:
      (!signatureData && !isPdfAlreadySigned) ||
      form.section ||
      form.assigneeId ||
      form.message,
  };
};
