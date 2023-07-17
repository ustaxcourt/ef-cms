import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoStyleGuideSequence = startWebSocketConnectionSequenceDecorator(
  [setupCurrentPageAction('StyleGuide')],
);
