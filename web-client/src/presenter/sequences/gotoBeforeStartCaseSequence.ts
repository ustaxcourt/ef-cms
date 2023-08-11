import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoBeforeStartCaseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('BeforeStartingCase'),
  ]);
