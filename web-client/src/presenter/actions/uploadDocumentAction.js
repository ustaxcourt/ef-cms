import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const caseToUpdate = get(state.caseDetail);

  const documentType = get(state.document.documentType);
  const useCase = applicationContext.getUseCaseForDocumentUpload(
    documentType,
    get(state.user.role),
  );
  await useCase({
    applicationContext,
    document: get(state.document.file),
    caseToUpdate,
    userId: get(state.user.token),
  });
  return {
    docketNumber: caseToUpdate.docketNumber,
    alertSuccess: {
      title: `Your ${documentType} was uploaded successfully.`,
      message: `Your document has been filed.`,
    },
  };
};
