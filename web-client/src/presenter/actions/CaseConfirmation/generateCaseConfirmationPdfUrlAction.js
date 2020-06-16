import { state } from 'cerebral';
/**
 * get the url from the case details
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting
 * baseUrl, token, caseId, and docketNumber
 * @param {Function} providers.store the cerebral store function used for
 * storing pdfPreviewUrl
 * @returns {object} the pdfUrl
 */
export const generateCaseConfirmationPdfUrlAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);

  const {
    url,
  } = await applicationContext.getUseCases().getDocumentDownloadUrlInteractor({
    applicationContext,
    caseId,
    documentId: `case-${docketNumber}-confirmation.pdf`,
  });

  store.set(state.pdfPreviewUrl, url);
};
