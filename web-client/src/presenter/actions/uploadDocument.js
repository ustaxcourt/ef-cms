import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const caseDetail = await useCases.fileAnswer({
    applicationContext,
    answerDocument: get(state.document.file),
    caseToUpdate: get(state.caseDetail),
    userId: get(state.user.token),
  });

  return {
    caseId: caseDetail.caseId,
    alertSuccess: {
      title: 'Your document was uploaded successfully.',
      message: 'Your document has been filed.',
    },
  };
};
