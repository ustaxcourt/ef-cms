import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const procedureTypes = await applicationContext
    .getUseCases()
    .getProcedureTypes({
      userId: get(state.user.userId),
    });
  return { procedureTypes };
};
