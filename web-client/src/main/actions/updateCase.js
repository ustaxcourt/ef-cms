import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  await useCases.updateCase({
    applicationContext,
    caseDetails: get(state.caseDetail),
    userToken: get(state.user.token),
  });

  return path.success({
    alertSuccess: {
      title: 'Success',
      message:
        'Case ' + get(state.caseDetail).docketNumber + ' has been updated.',
    },
  });
};
