import { state } from 'cerebral';

/**
 * serves a paper filed document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} props needed for later actions
 */
export const servePaperFiledDocumentAction = async ({
  applicationContext,
  get,
}) => {
  const caseId = get(state.caseDetail.caseId);
  const documentId = get(state.documentId);

  const {
    paperServicePdfUrl,
  } = await applicationContext
    .getUseCases()
    .serveExternallyFiledDocumentInteractor({
      applicationContext,
      caseId,
      documentId,
    });

  return {
    alertSuccess: {
      message: 'Document served.',
    },
    hasPaper: !!paperServicePdfUrl,
    pdfUrl: paperServicePdfUrl,
  };
};
