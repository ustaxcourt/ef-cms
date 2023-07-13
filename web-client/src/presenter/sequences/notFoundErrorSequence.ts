import { clearModalAction } from '../actions/clearModalAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const notFoundErrorSequence = startWebSocketConnectionSequenceDecorator([
  unsetWaitingForResponseOnErrorAction,
  setAlertFromExceptionAction,
  clearModalAction,
  setCurrentPageAction('ErrorView'),
]);
