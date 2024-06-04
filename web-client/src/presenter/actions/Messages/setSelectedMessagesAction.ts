import { state } from '../../app.cerebral';

export const setSelectedMessagesAction = ({
  get,
  props,
  store,
}: ActionProps<{ messages: { messageId: string; selected: boolean }[] }>) => {
  let selectedMap = get(state.messagesPage.selectedMessages);
  if (props.messages.length === 0) {
    selectedMap = new Map<string, boolean>();
  }
  props.messages.forEach(message => {
    if (message.selected) {
      selectedMap.set(message.messageId, message.selected);
    } else {
      selectedMap.delete(message.messageId);
    }
  });
  store.set(state.messagesPage.selectedMessages, selectedMap);
};
