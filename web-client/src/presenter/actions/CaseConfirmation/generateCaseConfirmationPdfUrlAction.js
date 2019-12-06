import { state } from 'cerebral';
/**
 * get the url from the case details
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the pdfUrl
 */
export const generateCaseConfirmationPdfUrlAction = async ({ get, store }) => {
  const baseUrl = get(state.baseUrl);
  const token = get(state.token);
  const { caseId, docketNumber } = get(state.caseDetail);

  const pdfPreviewUrl = `${baseUrl}/documents/${caseId}/case-${docketNumber}-confirmation.pdf/document-download-url?token=${token}`;

  store.set(state.pdfPreviewUrl, pdfPreviewUrl);
};
