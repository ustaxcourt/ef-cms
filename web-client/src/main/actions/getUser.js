import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const user = await useCases.getUser(get(state.form.name));
  if (user) return path.success({ user });
  return path.error({
    alertError: {
      title: 'User not found',
      message: 'Username or password are incorrect',
    },
  });
};
