import { state } from 'cerebral';

/**
 * Starts a delayed auto log-out
 *
 * @param {Object} providers.get the cerebral get function to retrieve state values
 * @param {Object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export const startDelayedLogoutAction = ({ get, store }) => {
  const oldTimer = get(state.logoutTimer);
  clearTimeout(oldTimer);

  const logoutTimer = setTimeout(() => {
    store.set(state.shouldIdleLogout, true);
  }, 5000);

  store.set(state.logoutTimer, logoutTimer);
};
