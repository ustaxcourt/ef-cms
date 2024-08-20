import { IDLE_LOGOUT_STATES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const handleIdleLogoutAction = ({ get, path, store }: ActionProps) => {
  const constants = get(state.constants);
  const lastIdleAction = get(state.lastIdleAction);
  const idleLogoutState = get(state.idleLogoutState);
  const isUploading = get(state.fileUploadProgress.isUploading);
  const userIsLoggedIn = !!get(state.token);
  const clientNeedsToRefresh = get(state.clientNeedsToRefresh);

  // Short-circuit here to prevent showing the "Are you still there?" modal, etc. when inappropriate
  if (!userIsLoggedIn || clientNeedsToRefresh) {
    return path.continue();
  }

  if (!isUploading && idleLogoutState.state === IDLE_LOGOUT_STATES.INITIAL) {
    store.set(state.idleLogoutState, {
      logoutAt:
        Date.now() +
        constants.SESSION_MODAL_TIMEOUT +
        constants.SESSION_TIMEOUT,
      state: IDLE_LOGOUT_STATES.MONITORING,
    });
    return path.continue();
  }

  if (idleLogoutState.state === IDLE_LOGOUT_STATES.MONITORING) {
    if (Date.now() > lastIdleAction + constants.SESSION_TIMEOUT) {
      store.set(state.idleLogoutState, {
        logoutAt:
          lastIdleAction +
          constants.SESSION_MODAL_TIMEOUT +
          constants.SESSION_TIMEOUT,
        state: IDLE_LOGOUT_STATES.COUNTDOWN,
      });
    }
    return path.continue();
  }

  if (idleLogoutState.state === IDLE_LOGOUT_STATES.COUNTDOWN) {
    if (Date.now() > idleLogoutState.logoutAt) {
      store.set(state.idleLogoutState, {
        logoutAt: undefined,
        state: IDLE_LOGOUT_STATES.INITIAL,
      });
      return path.logout();
    }
  }

  return path.continue();
};
