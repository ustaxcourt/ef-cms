import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

//todo: does this need startWebSocketConnectionSequenceDecorator?
export const navigateToPathSequence = startWebSocketConnectionSequenceDecorator(
  [clearErrorAlertsAction, navigateToPathAction],
);
