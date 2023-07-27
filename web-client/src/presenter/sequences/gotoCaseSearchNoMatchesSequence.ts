import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoCaseSearchNoMatchesSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('CaseSearchNoMatches'),
  ]);
