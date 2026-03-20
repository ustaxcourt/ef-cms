import { state } from '@web-client/presenter/app.cerebral';

export const setIsLoadingMessagesAction =
  (isLoading: boolean) =>
  ({ store }: ActionProps) => {
    store.set(state.messagesPage.isLoadingMessages, isLoading);
  };
