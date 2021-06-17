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
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntryId = get(state.docketEntryId);

  const { pdfUrl } = await applicationContext
    .getUseCases()
    .serveExternallyFiledDocumentInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Document served.',
    },
    hasPaper: !!pdfUrl,
    pdfUrl,
  };
};
