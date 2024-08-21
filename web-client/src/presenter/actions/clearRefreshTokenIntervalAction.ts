import { state } from '@web-client/presenter/app.cerebral';

export const clearRefreshTokenIntervalAction = ({
  get,
  store,
}: ActionProps) => {
  const oldInterval = get(state.refreshTokenInterval);
  clearInterval(oldInterval);
  store.unset(state.refreshTokenInterval);
};
