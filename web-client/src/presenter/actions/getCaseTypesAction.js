import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const caseTypes = await useCases.getCaseTypes({
    userId: get(state.user.userId),
  });
  if (caseTypes) {
    return path.success({ caseTypes });
  } else {
    return path.error({
      alertError: {
        title: 'Case types not found',
        message: 'There was an error retrieving the case types.',
      },
    });
  }
};
