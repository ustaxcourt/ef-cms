import { prepareCreatePractitionerUserFormAction } from '../actions/prepareCreatePractitionerUserFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoCreatePractitionerUserSequence = [
  stopShowValidationAction,
  prepareCreatePractitionerUserFormAction,
  setCurrentPageAction('CreatePractitionerUser'),
];
