import { state } from '@web-client/presenter/app.cerebral';

export const setTokenAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{ idToken: string }>): void => {
  store.set(state.token, props.idToken);

  applicationContext.setCurrentUserToken(props.idToken);
};
