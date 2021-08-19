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
}) => {
  const docketEntryId = get(state.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  const documentMeta = {
    ...form,
    docketEntryId,
    docketNumber,
  };

  const result = await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta,
    });

  return {
    alertSuccess: {
      message: 'Document served. ',
    },
    pdfUrl: result ? result.pdfUrl : undefined,
  };
};
