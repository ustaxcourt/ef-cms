import { state } from '@web-client/presenter/app.cerebral';

/**
 * serves a paper filed document
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.props the cerebral props function
 * @returns {object} props needed for later actions
 */
export const servePaperFiledDocumentAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntryId = get(state.docketEntryId);
  const clientConnectionId = get(state.clientConnectionId);
  const { docketNumbers } = props;
  const { DOCUMENT_SERVED_MESSAGES } = applicationContext.getConstants();

  const { pdfUrl } = await applicationContext
    .getUseCases()
    .serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: docketNumber,
    });

  return {
    alertSuccess: {
      message: DOCUMENT_SERVED_MESSAGES.GENERIC,
    },
    hasPaper: !!pdfUrl,
    pdfUrl,
  };
};
