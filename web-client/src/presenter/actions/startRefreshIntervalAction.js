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

  const refreshTokenRequest = async ({ refreshToken }) => {
    const response = await applicationContext
      .getUseCases()
      .refreshTokenInteractor(applicationContext, {
        refreshToken,
      });

    store.set(state.token, response.token);
    applicationContext.setCurrentUserToken(response.token);
    if (process.env.IS_LOCAL) {
      await applicationContext
        .getUseCases()
        .setItemInteractor(applicationContext, {
          key: 'token',
          value: response.token,
        });
    }
  };

  clearInterval(oldInterval);
  const time = applicationContext.getConstants().REFRESH_INTERVAL;
  const getNewIdToken = async () => {
    const refreshToken = get(state.refreshToken);
    await refreshTokenRequest({ refreshToken });
  };
  const interval = setInterval(getNewIdToken, time);
  getNewIdToken();
  store.set(state.refreshTokenInterval, interval);
};
