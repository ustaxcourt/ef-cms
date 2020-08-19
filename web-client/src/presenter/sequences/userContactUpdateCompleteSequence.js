import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';

export const userContactUpdateCompleteSequence = [
  stopWebSocketConnectionAction,
  set(state.userContactEditProgress, {}),
];
