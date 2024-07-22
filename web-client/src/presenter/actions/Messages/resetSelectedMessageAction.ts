import { state } from '@web-client/presenter/app.cerebral';

export const resetSelectedMessageAction = ({ store }) => {
  store.set(state.messagesPage.selectedMessages, new Map<string, string>());
};
