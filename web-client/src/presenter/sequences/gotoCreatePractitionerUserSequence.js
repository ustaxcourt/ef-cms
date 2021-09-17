import { prepareCreatePractitionerUserFormAction } from '../actions/prepareCreatePractitionerUserFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoCreatePractitionerUserSequence =
  startWebSocketConnectionSequenceDecorator([
    stopShowValidationAction,
    prepareCreatePractitionerUserFormAction,
    setCurrentPageAction('CreatePractitionerUser'),
  ]);
