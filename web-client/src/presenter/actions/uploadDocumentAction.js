import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const caseToUpdate = get(state.caseDetail);

  const documentType = get(state.document.documentType);
  const user = get(state.user);
  const useCase = applicationContext.getUseCaseForDocumentUpload(
    documentType,
    user.role,
  );

  const documentId = await useCase({
    applicationContext,
    document: get(state.document.file),
    caseToUpdate,
    userId: get(state.user.token),
  });

  await applicationContext.getUseCases().getUseCaseForDocumentUpdate({
    userId: user.userId,
    caseToUpdate: {
      documents: [
        ...(caseToUpdate.documents || []),
        {
          documentId,
        },
      ],
    },
    applicationContext,
  });

  return {
    docketNumber: caseToUpdate.docketNumber,
    alertSuccess: {
      title: `Your ${documentType} was uploaded successfully.`,
      message: `Your document has been filed.`,
    },
  };
};
