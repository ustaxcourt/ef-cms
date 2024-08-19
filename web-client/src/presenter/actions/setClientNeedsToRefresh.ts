import { state } from '@web-client/presenter/app.cerebral';

export const setClientNeedsToRefresh = ({ store }: ActionProps) => {
  store.set(state.clientNeedsToRefresh, true);
};
