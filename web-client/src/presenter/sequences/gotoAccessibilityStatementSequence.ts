import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoAccessibilityStatementSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('AccessibilityStatement'),
  ]);
