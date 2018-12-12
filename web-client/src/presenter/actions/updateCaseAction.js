import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  try {
    const caseDetail = await useCases.updateCase({
      applicationContext,
      caseToUpdate: get(state.caseDetail),
      userId: get(state.user.token),
    });

    return path.success({
      caseDetail,
      alertSuccess: {
        title: 'Success',
        message:
          'Case ' +
          get(state.formattedCaseDetail).docketNumber +
          ' has been updated.',
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
