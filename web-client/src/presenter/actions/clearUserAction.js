import { state } from 'cerebral';

export const clearUserAction = async ({ applicationContext, store }) => {
  store.unset(state.user);
  store.unset(state.token);
  store.unset(state.permissions);

  await applicationContext
    .getUseCases()
    .removeItemInteractor(applicationContext, {
      key: 'user',
    });
  await applicationContext
    .getUseCases()
    .removeItemInteractor(applicationContext, {
      key: 'token',
    });

  applicationContext.setCurrentUser(null);
};
