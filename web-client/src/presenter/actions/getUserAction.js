import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const user = await applicationContext
    .getUseCases()
    .getUser(props.userId || get(state.form.name));
  return { user };
};
