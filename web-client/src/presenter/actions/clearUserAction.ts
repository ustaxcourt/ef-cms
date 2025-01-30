import { cloneDeep } from 'lodash';
import { emptyUserState } from '@web-client/presenter/state/userState';
import { setCurrentUserToken } from '@shared/proxies/requests';
import { state } from '@web-client/presenter/app.cerebral';

export const clearUserAction = ({ store }: ActionProps) => {
  store.set(state.user, cloneDeep(emptyUserState));
  store.unset(state.judgeUser);
  store.unset(state.token);
  store.unset(state.permissions);
  setCurrentUserToken('');
};
