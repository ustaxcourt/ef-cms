import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const userContactUpdateCompleteSequence = [
  stopWebSocketConnectionAction,
  unsetUserContactEditProgressAction,
  getUserContactEditCompleteAlertSuccessAction,
  setAlertSuccessAction,
];
