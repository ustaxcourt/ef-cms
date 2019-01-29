import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const procedureTypes = await useCases.getProcedureTypes({
    userId: get(state.user.userId),
  });
  return { procedureTypes };
};
