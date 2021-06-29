import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const adminContactUpdateCompleteSequence = [
  stopWebSocketConnectionAction,
  unsetUserContactEditProgressAction,
];
