import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoStyleGuideSequence = startWebSocketConnectionSequenceDecorator(
  [setCurrentPageAction('StyleGuide')],
);
