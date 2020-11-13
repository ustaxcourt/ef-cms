import { state } from 'cerebral';

/**
 * fixme
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
    .fileAndServeCourtIssuedDocumentInteractor({
      applicationContext,
      documentMeta,
    });

  return {
    alertSuccess: {
      message: 'Document served. ',
    },
    pdfUrl: result ? result.pdfUrl : undefined,
  };
};
