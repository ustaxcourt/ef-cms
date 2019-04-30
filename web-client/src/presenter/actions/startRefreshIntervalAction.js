import { state } from 'cerebral';

/**
 * sets the state.showValidation to true
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.workItem
 */
export const startRefreshIntervalAction = ({
  applicationContext,
  store,
  get,
}) => {
  const oldInterval = get(state.refreshTokenInterval);
  clearInterval(oldInterval);
  const refreshToken = get(state.refreshToken);
  const time = applicationContext.getConstants().REFRESH_INTERVAL;
  const interval = setInterval(async () => {
    const response = await applicationContext.getUseCases().refreshToken({
      applicationContext,
      refreshToken,
    });

    store.set(state.token, response.token);
    applicationContext.setCurrentUserToken(response.token);
    window.localStorage.setItem('token', JSON.stringify(response.token));
  }, time);
  store.set(state.refreshTokenInterval, interval);
};
