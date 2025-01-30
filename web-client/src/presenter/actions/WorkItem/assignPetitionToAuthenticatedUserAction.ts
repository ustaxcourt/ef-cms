import { state } from '@web-client/presenter/app.cerebral';

export const assignPetitionToAuthenticatedUserAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const user = get(state.user);

  if (props.workItem) {
    await applicationContext
      .getUseCases()
      .assignWorkItemsInteractor(applicationContext, {
        assigneeId: user.userId,
        assigneeName: user.name,
        workItem: props.workItem,
      });
  }
};
