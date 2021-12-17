import { state } from 'cerebral';

/**
 * starts the token refresh interval
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const startRefreshIntervalAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const oldInterval = get(state.refreshTokenInterval);

  const refreshTokenRequest = async () => {
    const response = await applicationContext
      .getUseCases()
      .refreshTokenInteractor(applicationContext);

    store.set(state.token, response.token);
    applicationContext.setCurrentUserToken(response.token);
  };

  clearInterval(oldInterval);
  const time = applicationContext.getConstants().REFRESH_INTERVAL;
  const interval = setInterval(refreshTokenRequest, time);
  store.set(state.refreshTokenInterval, interval);
};
