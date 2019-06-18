import { state } from 'cerebral';

/**
 * sets the state.showValidation to true
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
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

    await applicationContext.getUseCases().setItem({
      applicationContext,
      key: 'token',
      value: response.token,
    });
  }, time);
  store.set(state.refreshTokenInterval, interval);
};
