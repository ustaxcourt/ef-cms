import { state } from 'cerebral';

export const clearUserAction = async ({ applicationContext, store }) => {
  store.set(state.user, null);
  store.set(state.token, null);
  await applicationContext.getUseCases().removeItem({
    applicationContext,
    key: 'user',
  });
  await applicationContext.getUseCases().removeItem({
    applicationContext,
    key: 'token',
  });
  applicationContext.setCurrentUser(null);
};
