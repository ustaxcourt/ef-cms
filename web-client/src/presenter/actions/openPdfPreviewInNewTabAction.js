/**
 * opens the pdfUrl from props in a new tab
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.router the riot.router object that is used for changing the route
 */
export const openPdfPreviewInNewTabAction = ({ props, router }) => {
  const { pdfUrl } = props;

  router.openInNewTab(pdfUrl);
};
