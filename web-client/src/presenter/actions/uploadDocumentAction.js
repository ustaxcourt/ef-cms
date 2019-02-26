import { state } from 'cerebral';

/**
 * uploads the document file and metadata via the getUseCaseForDocumentUpload use case.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the getUseCaseForDocumentUpload use case
 * @param {Object} providers.get the cerebral store used for getting state.caseDetail and state.document
 * @returns {Object} the alertSuccess and the generated docketNumber
 */
export const uploadDocumentAction = async ({ applicationContext, get }) => {
  const caseToUpdate = get(state.caseDetail);

  const documentType = get(state.document.documentType);

  const user = get(state.user);

  await applicationContext.getUseCaseForDocumentUpload(documentType, user.role)(
    {
      applicationContext,
      document: get(state.document.file),
      caseToUpdate,
      userId: user.token,
    },
  );

  return {
    docketNumber: caseToUpdate.docketNumber,
    alertSuccess: {
      title: `Your ${documentType} was uploaded successfully.`,
      message: 'Your document has been filed.',
    },
  };
};
