import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const caseToUpdate = get(state.caseDetail);
  console.log(get(state.document.documentType))
  console.log(get(state.user.role))
  const useCase = applicationContext.getUseCaseForDocumentUpload(
    get(state.document.documentType),
    get(state.user.role),
  );
  await useCase({
    applicationContext,
    answerDocument: get(state.document.file),
    caseToUpdate,
    userId: get(state.user.token),
  });
  return {
    docketNumber: caseToUpdate.docketNumber,
    alertSuccess: {
      title: 'Your document was uploaded successfully.',
      message: 'Your document has been filed.',
    },
  };
};
