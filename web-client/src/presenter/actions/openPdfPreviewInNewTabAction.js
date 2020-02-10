/**
 * opens the pdfUrl from props in a new tab
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 */
export const openPdfPreviewInNewTabAction = ({ props }) => {
  const { pdfUrl } = props;

  window.open(pdfUrl, '_blank');
};
