import { state } from '@web-client/presenter/app.cerebral';

export const setIsLoadingWorkQueueAction =
  (isLoading: boolean) =>
  ({ store }: ActionProps) => {
    store.set(state.workQueuePage.isLoadingWorkQueue, isLoading);
  };
