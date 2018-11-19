import { state } from 'cerebral';

export default async ({ useCases, get, path }) => {
  const user = await useCases.getUser(get(state.form.name));
  if (user) return path.success({ user });
  return path.error({
    alertError: {
      title: 'User not found',
      message: 'Username or password are incorrect',
    },
  });
};
