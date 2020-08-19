import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';

export const userContactUpdateErrorSequence = [
  stopWebSocketConnectionAction,
  set(state.userContactEditProgress, {}),
];
