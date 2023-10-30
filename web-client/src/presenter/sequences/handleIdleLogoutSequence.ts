import { gotoIdleLogoutSequence } from '@web-client/presenter/sequences/gotoIdleLogoutSequence';
import { state } from '@web-client/presenter/app.cerebral';

export const handleIdleLogoutSequence = [
  ({ get, path, store }) => {
    const constants = get(state.constants);
    const lastIdleAction = get(state.lastIdleAction);
    const idleLogoutState = get(state.idleLogoutState);
    const isUploading = get(state.fileUploadProgress.isUploading);
    const user = get(state.user);

    if (user && !isUploading && idleLogoutState.state === 'INITIAL') {
      store.set(state.idleLogoutState, {
        logoutAt:
          Date.now() +
          constants.SESSION_MODAL_TIMEOUT +
          constants.SESSION_TIMEOUT,
        state: 'MONITORING',
      });
    } else if (idleLogoutState.state === 'MONITORING') {
      if (Date.now() > lastIdleAction + constants.SESSION_TIMEOUT) {
        store.set(state.idleLogoutState, {
          logoutAt:
            lastIdleAction +
            constants.SESSION_MODAL_TIMEOUT +
            constants.SESSION_TIMEOUT,
          state: 'COUNTDOWN',
        });
      }
    } else if (idleLogoutState.state === 'COUNTDOWN') {
      if (Date.now() > idleLogoutState.logoutAt) {
        store.set(state.idleLogoutState, {
          logoutAt: undefined,
          state: 'INITIAL',
        });
        return path.logout();
      }
    }

    return path.continue();
  },
  {
    continue: [],
    logout: gotoIdleLogoutSequence,
  },
];
