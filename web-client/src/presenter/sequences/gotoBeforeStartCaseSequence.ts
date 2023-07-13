import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoBeforeStartCaseSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('BeforeStartingCase'),
  ]);
