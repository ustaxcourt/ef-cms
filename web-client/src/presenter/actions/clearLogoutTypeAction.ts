import { state } from '@web-client/presenter/app.cerebral';

export const clearLogoutTypeAction = ({ store }: ActionProps) => {
  store.unset(state.logoutType);
};
