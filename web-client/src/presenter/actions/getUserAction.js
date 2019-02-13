import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const userId = props.userId || get(state.form.name);
  const user = await applicationContext.getUseCases().getUser(userId);
  return { user };
};
