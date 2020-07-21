import { state } from 'cerebral';

/**
 * fixme
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the props needed for removing signature
 */
export const removeSignatureAction = async ({ applicationContext, props }) => {
  const { caseId } = props.caseDetail;
  const documentId = props.documentIdToEdit;

  const updatedCase = await applicationContext
    .getUseCases()
    .removeSignatureFromDocumentInteractor({
      applicationContext,
      caseId,
      documentId,
    });

  return { caseDetail: updatedCase };
};
