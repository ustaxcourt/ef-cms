import { state } from '@web-client/presenter/app.cerebral';

/**
 * File and serve a court issued document
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props function
 * @returns {Promise<*>} the success message after the document has been filed and served
 */
export const fileAndServeCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketEntryId = get(state.docketEntryId);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const clientConnectionId = get(state.clientConnectionId);

  const { docketNumbers } = props;

  await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers,
      form,
      subjectCaseDocketNumber: caseDetail.docketNumber,
    });
};
