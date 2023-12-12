import { state } from '@web-client/presenter/app.cerebral';

export const setTabAction =
  tab =>
  ({ store }: ActionProps) => {
    store.set(state.currentViewMetadata.tab, tab);
  };
