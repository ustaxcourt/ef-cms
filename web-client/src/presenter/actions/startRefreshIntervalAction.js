import { state } from 'cerebral';

/**
 * starts the token refresh interval
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const startRefreshIntervalAction = ({
  applicationContext,
  get,
  store,
}) => {
  const oldInterval = get(state.refreshTokenInterval);
  clearInterval(oldInterval);
  const refreshToken = get(state.refreshToken);
  const time = applicationContext.getConstants().REFRESH_INTERVAL;
  const interval = setInterval(async () => {
    const response = await applicationContext
      .getUseCases()
      .refreshTokenInteractor(applicationContext, {
        refreshToken,
      });

    store.set(state.token, response.token);
    applicationContext.setCurrentUserToken(response.token);

    await applicationContext
      .getUseCases()
      .setItemInteractor(applicationContext, {
        key: 'token',
        value: response.token,
      });
  }, time);
  store.set(state.refreshTokenInterval, interval);
};
