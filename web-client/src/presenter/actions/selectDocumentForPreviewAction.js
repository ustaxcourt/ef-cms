export const selectDocumentForPreviewAction = ({ props }) => {
  const pdfUrl = window.URL.createObjectURL(props.file); // must be revoked at a later time.
  return { pdfUrl };
};
