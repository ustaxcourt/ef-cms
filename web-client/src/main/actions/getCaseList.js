import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const userId = get(state.user.userId);
  try {
    const caseList = await useCases.getCasesByUser(applicationContext, userId);
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
