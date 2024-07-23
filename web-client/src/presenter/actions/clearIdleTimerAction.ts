import { state } from '@web-client/presenter/app.cerebral';

export const clearIdleTimerAction = ({ store }: ActionProps) => {
  store.unset(state.lastIdleAction);
  store.set(state.idleLogoutState, {
    logoutAt: undefined,
    state: 'INITIAL',
  });
};
