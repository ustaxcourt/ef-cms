import { setSelectedMessagesAction } from '../actions/Messages/setSelectedMessagesAction';

export const setSelectedMessagesSequence = [
  setSelectedMessagesAction,
] as unknown as (props: { messageIds: string[] }) => void;
