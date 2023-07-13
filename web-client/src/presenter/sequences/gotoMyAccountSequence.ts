import { resetHeaderAccordionsSequence } from '../sequences/resetHeaderAccordionsSequence';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoMyAccountSequence = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('MyAccount'),
  resetHeaderAccordionsSequence,
]);
