import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const userId = get(state.user.userId);
  let workItems = await useCases.getWorkItems({
    applicationContext,
    userId,
  });
  return { workItems };
};
