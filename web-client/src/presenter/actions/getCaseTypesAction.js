import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const caseTypes = await applicationContext.getUseCases().getCaseTypes({
    userId: get(state.user.userId),
  });
  return { caseTypes };
};
