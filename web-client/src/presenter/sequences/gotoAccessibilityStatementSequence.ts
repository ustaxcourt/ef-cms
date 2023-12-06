import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoAccessibilityStatementSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('AccessibilityStatement'),
  ]);
