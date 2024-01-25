import { state } from '@web-client/presenter/app.cerebral';
/**
 * calls use case to remove signature from the document in props.docketEntryIdToEdit
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the props needed for removing signature
 */
export const removeSignatureAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { docketNumber } = props.caseDetail;
  const docketEntryId = props.docketEntryIdToEdit;

  const viewerDraftDocumentToDisplay = get(state.viewerDraftDocumentToDisplay);

  const updatedCase = await applicationContext
    .getUseCases()
    .removeSignatureFromDocumentInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  return {
    alertSuccess: { message: 'Signature removed.' },
    caseDetail: updatedCase,
    viewerDraftDocumentToDisplay: {
      docketEntryId,
      documentType: viewerDraftDocumentToDisplay.documentType,
    },
  };
};
