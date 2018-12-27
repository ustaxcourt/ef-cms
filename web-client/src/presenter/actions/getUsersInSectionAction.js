import { state } from 'cerebral';

export default section => async ({ applicationContext, store }) => {
  const users = await applicationContext
    .getUseCases()
    .getUsersInSection(section);
  store.set(state.users, users);
};
