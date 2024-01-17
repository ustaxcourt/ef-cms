import { state } from '@web-client/presenter/app.cerebral';

export const startRefreshIntervalAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const oldInterval = get(state.refreshTokenInterval);

  const refreshTokenRequest = async () => {
    const userIsLoggedIn = get(state.token);
    if (userIsLoggedIn) {
      const response = await applicationContext
        .getUseCases()
        .renewIdTokenInteractor(applicationContext);

      store.set(state.token, response.idToken);
      applicationContext.setCurrentUserToken(response.idToken);
    }
  };

  clearInterval(oldInterval);

  const time = applicationContext.getConstants().REFRESH_INTERVAL;
  const interval = setInterval(refreshTokenRequest, time);

  store.set(state.refreshTokenInterval, interval);
};
