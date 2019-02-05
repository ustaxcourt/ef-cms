import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const user = await applicationContext
    .getUseCases()
    .getUser(get(state.form.name));
  return { user };
};
