import { state } from 'cerebral';

/**
 * File and serve a court issued document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @returns {Promise<*>} the success message after the document has been filed and served
 */
export const fileAndServeCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  let { docketNumbers } = props;

  const clientConnectionId = get(state.clientConnectionId);

  await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        docketEntryId,
        docketNumbers,
        form,
        subjectCaseDocketNumber: caseDetail.docketNumber,
      },
      clientConnectionId,
    );
};
