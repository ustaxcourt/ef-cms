import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';

export const adminContactUpdateErrorSequence = [
  stopWebSocketConnectionAction,
  // TODO: might need to update some state
];
