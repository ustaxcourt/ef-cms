export const selectDocumentForPreviewAction = ({ props }) => {
  const pdfFile = new File([props.file], 'Preview', {
    type: 'application/pdf',
  });
  const pdfUrl = window.URL.createObjectURL(pdfFile); // must be revoked at a later time.
  return { pdfUrl };
};
