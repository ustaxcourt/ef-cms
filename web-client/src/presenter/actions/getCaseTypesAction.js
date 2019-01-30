import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const caseTypes = await useCases.getCaseTypes({
    userId: get(state.user.userId),
  });
  return { caseTypes };
};
