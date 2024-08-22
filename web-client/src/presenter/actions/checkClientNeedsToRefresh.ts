import { state } from '@web-client/presenter/app.cerebral';

export const checkClientNeedsToRefresh = ({ get, path }: ActionProps) => {
  return get(state.clientNeedsToRefresh)
    ? path.clientNeedsToRefresh()
    : path.clientDoesNotNeedToRefresh();
};
