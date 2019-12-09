/**
 * calls router.printIframeWithId for the pdf-preview-iframe
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object containing the printIframeWithId function
 */
export const printPdfFromIframeAction = ({ router }) => {
  router.printIframeWithId('pdf-preview-iframe');
};
