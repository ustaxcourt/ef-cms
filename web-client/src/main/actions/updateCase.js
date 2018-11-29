import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const caseDetail = await useCases.updateCase({
    applicationContext,
    caseDetails: get(state.caseDetail),
    userToken: get(state.user.token),
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
};
