import { IDLE_LOGOUT_STATES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const clearIdleTimerAction = ({ store }: ActionProps) => {
  store.unset(state.lastIdleAction);
  store.set(state.idleLogoutState, {
    logoutAt: undefined,
    state: IDLE_LOGOUT_STATES.INITIAL,
  });
};
