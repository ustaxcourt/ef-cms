import { state } from '@web-client/presenter/app.cerebral';

export const setLogoutTypeAction =
  logoutType =>
  ({ store }: ActionProps) => {
    store.set(state.logoutType, logoutType);
  };
