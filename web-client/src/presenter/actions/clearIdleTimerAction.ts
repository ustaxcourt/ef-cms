import { LOGOUT_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const clearIdleTimerAction = ({ store }: ActionProps) => {
  store.unset(state.lastIdleAction);
  store.set(state.idleLogoutState, {
    logoutAt: undefined,
    state: LOGOUT_OPTIONS.idleLogoutStates.INITIAL,
  });
};
