import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedMessagesAction = ({
  get,
  props,
  store,
}: ActionProps<{
  messages: { messageId: string; parentMessageId: string }[];
}>) => {
  let selectedMap = get(state.messagesPage.selectedMessages);
  if (props.messages.length === 0) {
    selectedMap = new Map<string, string>(); // why a map tho
  }
  props.messages.forEach(message => {
    // if (message.selected) {
    //   selectedMap.set(message.messageId, message.selected);
    // } else {
    //   selectedMap.delete(message.messageId);
    // }
    if (selectedMap.has(message.messageId)) {
      selectedMap.set(message.messageId, message.parentMessageId);
    } else {
      selectedMap.delete(message.messageId);
    }
  });
  store.set(state.messagesPage.selectedMessages, selectedMap);
};
