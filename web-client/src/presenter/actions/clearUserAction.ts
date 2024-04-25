import { state } from '@web-client/presenter/app.cerebral';

export const clearUserAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
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
  applicationContext.setCurrentUserToken(null);
};
