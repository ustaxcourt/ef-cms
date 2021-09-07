import { resetHeaderAccordionsSequence } from '../sequences/resetHeaderAccordionsSequence';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoMyAccountSequence = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('MyAccount'),
  resetHeaderAccordionsSequence,
]);
