import { LOGOUT_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const handleIdleLogoutAction = ({ get, path, store }: ActionProps) => {
  const constants = get(state.constants);
  const lastIdleAction = get(state.lastIdleAction);
  const idleLogoutState = get(state.idleLogoutState);
  const isUploading = get(state.fileUploadProgress.isUploading);
  const user = get(state.user);

  if (
    user &&
    !isUploading &&
    idleLogoutState.state === LOGOUT_OPTIONS.idleLogoutStates.INITIAL
  ) {
    store.set(state.idleLogoutState, {
      logoutAt:
        Date.now() +
        constants.SESSION_MODAL_TIMEOUT +
        constants.SESSION_TIMEOUT,
      state: LOGOUT_OPTIONS.idleLogoutStates.MONITORING,
    });
  } else if (
    idleLogoutState.state === LOGOUT_OPTIONS.idleLogoutStates.MONITORING
  ) {
    if (Date.now() > lastIdleAction + constants.SESSION_TIMEOUT) {
      store.set(state.idleLogoutState, {
        logoutAt:
          lastIdleAction +
          constants.SESSION_MODAL_TIMEOUT +
          constants.SESSION_TIMEOUT,
        state: LOGOUT_OPTIONS.idleLogoutStates.COUNTDOWN,
      });
    }
  } else if (
    idleLogoutState.state === LOGOUT_OPTIONS.idleLogoutStates.COUNTDOWN
  ) {
    if (Date.now() > idleLogoutState.logoutAt) {
      store.set(state.idleLogoutState, {
        logoutAt: undefined,
        state: LOGOUT_OPTIONS.idleLogoutStates.INITIAL,
      });
      return path.logout();
    }
  }

  return path.continue();
};
