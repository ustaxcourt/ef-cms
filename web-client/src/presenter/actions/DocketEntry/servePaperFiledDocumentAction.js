import { state } from 'cerebral';

/**
 * serves a paper filed document
 *
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
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntryId = get(state.docketEntryId);
  const { docketNumbers } = props;

  const { pdfUrl } = await applicationContext
    .getUseCases()
    .serveExternallyFiledDocumentInteractor(applicationContext, {
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Document served.',
    },
    hasPaper: !!pdfUrl,
    pdfUrl,
  };
};
