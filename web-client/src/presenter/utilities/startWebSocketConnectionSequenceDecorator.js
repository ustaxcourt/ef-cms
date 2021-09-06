import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startWebSocketConnectionAction } from '../actions/WebSocketConnection/startWebSocketConnectionAction';

export const startWebSocketConnectionSequenceDecorator = actionsList => {
  const wrappedActions = [
    startWebSocketConnectionAction,
    {
      error: [setShowModalFactoryAction('WebSocketErrorModal')],
      success: [],
    },
    ...actionsList,
  ];
  return wrappedActions;
};
