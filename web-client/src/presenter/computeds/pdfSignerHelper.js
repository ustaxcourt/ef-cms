import { state } from 'cerebral';

export const pdfSignerHelper = get => {
  const form = get(state.form);
  const signatureData = get(state.pdfForSigning.signatureData);

  return {
    disableSaveAndSendButton:
      !signatureData || (!form.section && !form.assigneeId && !form.message),
    disableSaveButton:
      !signatureData || form.section || form.assigneeId || form.message,
  };
};
