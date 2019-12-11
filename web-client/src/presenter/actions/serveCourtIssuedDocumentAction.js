import { state } from 'cerebral';

/**
 * initiates the document to be served
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object containing the createObjectURL function
 * @returns {object} the user
 */
export const serveCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
  router,
}) => {
  const documentId = get(state.documentId);
  const caseId = get(state.caseDetail.caseId);

  const paperServicePdfData = await applicationContext
    .getUseCases()
    .serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId,
      documentId,
    });

  let pdfUrl = null;
  if (
    paperServicePdfData &&
    (paperServicePdfData.size > 0 || paperServicePdfData.length > 0)
  ) {
    const pdfFile = new Blob([paperServicePdfData], {
      type: 'application/pdf',
    });

    pdfUrl = router.createObjectURL(pdfFile);
  }

  return {
    alertSuccess: {
      message:
        'Remember to print all documents for parties with paper service.',
      title: 'This document has been served',
    },
    pdfUrl,
  };
};
