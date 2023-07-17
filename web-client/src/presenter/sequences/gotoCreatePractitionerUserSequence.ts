import { prepareCreatePractitionerUserFormAction } from '../actions/prepareCreatePractitionerUserFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoCreatePractitionerUserSequence =
  startWebSocketConnectionSequenceDecorator([
    stopShowValidationAction,
    prepareCreatePractitionerUserFormAction,
    setupCurrentPageAction('CreatePractitionerUser'),
  ]);
