import { state } from 'cerebral';

export const setWorkItemAsReadAction = async ({ applicationContext, get }) => {
  await applicationContext.getUseCases().setWorkItemAsRead({
    applicationContext,
    workItemId: get(state.workItemId),
  });
};
