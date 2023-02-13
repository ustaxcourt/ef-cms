import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoCaseSearchNoMatchesSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('CaseSearchNoMatches'),
  ]);
