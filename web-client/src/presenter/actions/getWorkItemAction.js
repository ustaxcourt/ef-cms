import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const workItem = await applicationContext.getUseCases().getWorkItem({
    applicationContext,
    docketNumber: props.docketNumber,
    userId: get(state.user.token),
  });
  return { workItem };
};
