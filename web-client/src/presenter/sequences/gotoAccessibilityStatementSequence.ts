import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoAccessibilityStatementSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('AccessibilityStatement'),
  ]);
