import { state } from 'cerebral';

export const clearUserAction = async ({ applicationContext, store }) => {
  store.set(state.user, null);
  store.set(state.token, null);
  await applicationContext.getUseCases().removeItemInteractor({
    applicationContext,
    key: 'user',
  });
  await applicationContext.getUseCases().removeItemInteractor({
    applicationContext,
    key: 'token',
  });
  applicationContext.setCurrentUser(null);
};
