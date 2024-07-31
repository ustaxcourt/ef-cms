import { cloneDeep } from 'lodash';
import { emptyUserState } from '@web-client/presenter/state/userState';
import { setCurrentUserToken } from '@shared/proxies/requests';
import { state } from '@web-client/presenter/app.cerebral';

export const clearUserAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.user, cloneDeep(emptyUserState));
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

  setCurrentUserToken('');
};
