import { clearFormAction } from '../actions/clearFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoChangeLoginAndServiceEmailSequence =
  startWebSocketConnectionSequenceDecorator([
    clearFormAction,
    setupCurrentPageAction('ChangeLoginAndServiceEmail'),
  ]);
