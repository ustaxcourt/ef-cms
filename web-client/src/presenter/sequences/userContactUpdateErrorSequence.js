import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const userContactUpdateErrorSequence = [
  stopWebSocketConnectionAction,
  unsetUserContactEditProgressAction,
];
