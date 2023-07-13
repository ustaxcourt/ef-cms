import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoCaseSearchNoMatchesSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('CaseSearchNoMatches'),
  ]);
