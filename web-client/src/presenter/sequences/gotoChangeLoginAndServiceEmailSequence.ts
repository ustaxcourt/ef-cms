import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoChangeLoginAndServiceEmailSequence =
  startWebSocketConnectionSequenceDecorator([
    stopShowValidationAction,
    clearAlertsAction,
    clearErrorAlertsAction,
    clearFormAction,
    setupCurrentPageAction('ChangeLoginAndServiceEmail'),
  ]);
