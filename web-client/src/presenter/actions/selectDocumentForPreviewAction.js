export const selectDocumentForPreviewAction = ({ props, router }) => {
  const pdfUrl = router.createObjectURL(props.file); // must be revoked at a later time.
  return { pdfUrl };
};
