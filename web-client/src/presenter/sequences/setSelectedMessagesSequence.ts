import { setSelectedMessagesAction } from '../actions/Messages/setSelectedMessagesAction';

export const setSelectedMessagesSequence = [
  setSelectedMessagesAction,
] as unknown as (props: {
  messages: { messageId: string; parentMessageId: string }[];
}) => void;
