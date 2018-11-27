import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  try {
    const caseList = await useCases.getCasesByStatus({
      applicationContext,
      userToken: get(state.user.token),
      status: 'new',
    });
    return path.success({ caseList });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'Cases not found',
        message: 'There was a problem getting the cases',
      },
    });
  }
};
