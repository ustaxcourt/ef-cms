import { prepareCreateAttorneyUserFormAction } from '../actions/prepareCreateAttorneyUserFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoCreateAttorneyUserSequence = [
  prepareCreateAttorneyUserFormAction,
  setCurrentPageAction('CreateAttorneyUser'),
];
