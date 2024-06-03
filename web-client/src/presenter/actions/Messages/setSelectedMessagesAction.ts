import { state } from '../../app.cerebral';

export const setSelectedMessagesAction = ({
  get,
  props,
  store,
}: ActionProps<{
  messageId?: string;
  selectAll?: boolean;
}>) => {
  if ('selectAll' in props) {
    const allMessageIds: string[] = get(state.messages).map(
      message => message.messageId,
    );
    const selectedMessageIds = props.selectAll ? allMessageIds : [];
    store.set(state.messagesPage.selectedMessages, selectedMessageIds);
    return;
  }

  if (props.messageId) {
    const selectedMessages = get(state.messagesPage.selectedMessages);
    const messageIndex = selectedMessages.findIndex(
      message => message === props.messageId,
    );
    if (messageIndex !== -1) {
      selectedMessages.splice(messageIndex, 1);
    } else {
      selectedMessages.push(props.messageId);
    }
    store.set(state.messagesPage.selectedMessages, selectedMessages);
  }
};
