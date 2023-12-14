import { state } from '@web-client/presenter/app.cerebral';

export const setTokenAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{ idToken: string; refreshToken: string }>): void => {
  store.set(state.token, props.idToken);
  store.set(state.refreshToken, props.refreshToken || null);
  applicationContext.setCurrentUserToken(props.idToken);
};
