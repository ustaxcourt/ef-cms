/**
 * sets the state.screenMetadata.pristine to the props.users passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const openPdfPreviewInNewTabAction = ({ props }) => {
  const { pdfUrl } = props;

  window.open(pdfUrl, '_blank');
};
