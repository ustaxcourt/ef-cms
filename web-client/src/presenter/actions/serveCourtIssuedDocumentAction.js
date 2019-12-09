import { state } from 'cerebral';

/**
 * initiates the document to be served
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.props the cerebral props object used for getting the props.user
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

  let pdfUrl;
  if (paperServicePdfData) {
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
