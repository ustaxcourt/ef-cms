import { prepareCreatePractitionerUserFormAction } from '../actions/prepareCreatePractitionerUserFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoCreatePractitionerUserSequence = [
  prepareCreatePractitionerUserFormAction,
  setCurrentPageAction('CreatePractitionerUser'),
];
