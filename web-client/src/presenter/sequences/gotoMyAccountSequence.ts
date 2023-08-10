import { resetHeaderAccordionsSequence } from '../sequences/resetHeaderAccordionsSequence';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoMyAccountSequence = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('MyAccount'),
  resetHeaderAccordionsSequence,
]);
