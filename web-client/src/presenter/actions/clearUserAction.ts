import { setCurrentUserToken } from '@shared/proxies/requests';
import { state } from '@web-client/presenter/app.cerebral';

export const clearUserAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  store.unset(state.user);
  store.unset(state.token);
  store.unset(state.permissions);
  console.debug('user cleared', get(state.user));

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

  setCurrentUserToken('');
};
