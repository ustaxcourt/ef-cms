import { state } from 'cerebral';

export const setWorkItemAsReadAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  await applicationContext
    .getUseCases()
    .setWorkItemAsReadInteractor(applicationContext, {
      workItemId: get(state.workItemId),
    });
};
