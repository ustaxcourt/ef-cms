import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const caseToUpdate = get(state.caseDetail);
  await useCases.fileAnswer({
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
