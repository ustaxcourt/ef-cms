import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const adminContactUpdateCompleteSequence = [
  stopWebSocketConnectionAction,
  unsetUserContactEditProgressAction,
];
