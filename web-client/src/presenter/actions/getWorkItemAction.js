import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const workItem = await applicationContext.getUseCases().getWorkItem({
    applicationContext,
    workItemId: props.workItemId,
    userId: get(state.user.token),
  });
  return { workItem };
};
