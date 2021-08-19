import { state } from 'cerebral';

/**
 * get the url from the case details
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the pdfUrl
 */
export const generateCaseConfirmationPdfUrlAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const { url } = await applicationContext
    .getUseCases()
    .getDocumentDownloadUrlInteractor(applicationContext, {
      docketNumber,
      key: `case-${docketNumber}-confirmation.pdf`,
    });

  store.set(state.pdfPreviewUrl, url);
};
