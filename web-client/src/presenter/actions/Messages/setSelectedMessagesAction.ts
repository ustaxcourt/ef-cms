import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedMessagesAction = ({
  get,
  props,
  store,
}: ActionProps<{
  messages: { messageId: string; parentMessageId: string }[];
}>) => {
  let selectedMessagesMap = get(state.messagesPage.selectedMessages);
  const allMessagesSelected = get(
    state.messagesIndividualInboxHelper.allMessagesSelected,
  );
  const { messages } = props;

  const selectAllBoxChecked = messages.length > 1;

  if ((selectAllBoxChecked && allMessagesSelected) || messages.length === 0) {
    selectedMessagesMap.clear();
  } else {
    messages.forEach(message => {
      if (!selectedMessagesMap.has(message.messageId)) {
        selectedMessagesMap.set(message.messageId, message.parentMessageId);
      } else if (!selectAllBoxChecked) {
        selectedMessagesMap.delete(message.messageId);
      }
    });
  }

  store.set(state.messagesPage.selectedMessages, selectedMessagesMap);
};
