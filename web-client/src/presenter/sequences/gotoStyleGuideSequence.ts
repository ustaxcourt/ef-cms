import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoStyleGuideSequence = startWebSocketConnectionSequenceDecorator(
  [setCurrentPageAction('StyleGuide')],
);
