import { setCurrentUserToken } from '@shared/proxies/requests';
import { state } from '@web-client/presenter/app.cerebral';

export const setTokenAction = ({
  props,
  store,
}: ActionProps<{ idToken: string }>): void => {
  store.set(state.token, props.idToken);

  setCurrentUserToken(props.idToken);
};
