import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  try {
    const caseDetail = await useCases.fileAnswer({
      applicationContext,
      answerDocument: get(state.document.file),
      caseToUpdate: get(state.caseDetail),
      userId: get(state.user.token),
    });

    return path.success({
      caseDetail,
      alertSuccess: {
        title: 'Success',
        message: 'document uploaded',
      },
    });
  } catch (error) {
    return path.error({
      alertError: {
        title: 'Error',
        message: error.response.data,
      },
    });
  }
};
