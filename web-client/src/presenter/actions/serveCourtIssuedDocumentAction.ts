import { state } from '@web-client/presenter/app.cerebral';

/**
 * initiates the document to be served
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.props the cerebral props function
 */
export const serveCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketEntryId = get(state.docketEntryId);
  const clientConnectionId = get(state.clientConnectionId);
  const caseDetail = get(state.caseDetail);
  const { docketNumbers } = props;

  await applicationContext
    .getUseCases()
    .serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: caseDetail.docketNumber,
    });
};
