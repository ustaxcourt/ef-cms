import { IdleLogoutType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setLogoutTypeAction =
  (logoutType: IdleLogoutType) =>
  ({ store }: ActionProps) => {
    store.set(state.logoutType, logoutType);
  };
