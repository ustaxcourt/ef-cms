import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startWebSocketConnectionAction } from '../actions/WebSocketConnection/startWebSocketConnectionAction';

export const startWebSocketConnectionSequence = [
  startWebSocketConnectionAction,
  {
    error: [setShowModalFactoryAction('WebSocketErrorModal')],
    success: [],
  },
];
