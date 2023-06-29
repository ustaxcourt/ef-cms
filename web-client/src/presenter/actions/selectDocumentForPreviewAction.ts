/**
 * Creates an object url for the given props.file
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.router the application router implementation
 * @returns {string} pdfUrl url pointing to in-memory pdf document
 */

export const selectDocumentForPreviewAction = ({
  props,
  router,
}: ActionProps) => {
  const pdfUrl = router.createObjectURL(props.file); // must be revoked at a later time.
  return { pdfUrl };
};
