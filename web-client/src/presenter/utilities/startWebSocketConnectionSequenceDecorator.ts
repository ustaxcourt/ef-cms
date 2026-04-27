import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startReadOnlyModePollingAction } from '../actions/WebSocketConnection/startReadOnlyModePollingAction';
import { startWebSocketConnectionAction } from '../actions/WebSocketConnection/startWebSocketConnectionAction';

export const startWebSocketConnectionSequenceDecorator = actionsList => {
  const wrappedActions = [
    startWebSocketConnectionAction,
    {
      error: [setShowModalFactoryAction('WebSocketErrorModal')],
      startPolling: [startReadOnlyModePollingAction],
      success: [],
    },
    ...actionsList,
  ];
  return wrappedActions;
};
