import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const procedureTypes = await useCases.getProcedureTypes({
    userId: get(state.user.userId),
  });
  if (procedureTypes) {
    return path.success({ procedureTypes });
  } else {
    return path.error({
      alertError: {
        title: 'Procedure types not found',
        message: 'There was an error retrieving the procedure types.',
      },
    });
  }
};
