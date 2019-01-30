import { state } from 'cerebral';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const user = await useCases.getUser(get(state.form.name));
  return { user };
};
