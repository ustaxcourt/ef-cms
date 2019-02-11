import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const filingTypes = await applicationContext.getUseCases().getFilingTypes({
    userId: get(state.user.userId),
  });
  return { filingTypes };
};
