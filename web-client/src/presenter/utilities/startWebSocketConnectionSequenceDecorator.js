import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startWebSocketConnectionAction } from '../actions/WebSocketConnection/startWebSocketConnectionAction';

export const startWebSocketConnectionSequenceDecorator = actionsList => {
  const wrappedActions = [
    () => console.log('omg im in the decorator'),
    startWebSocketConnectionAction,
    {
      error: [setShowModalFactoryAction('WebSocketErrorModal')],
      success: [],
    },
    ...actionsList,
  ];
  return wrappedActions;
};
