import { clearFormAction } from '../actions/clearFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoChangeLoginAndServiceEmailSequence =
  startWebSocketConnectionSequenceDecorator([
    clearFormAction,
    setCurrentPageAction('ChangeLoginAndServiceEmail'),
  ]);
