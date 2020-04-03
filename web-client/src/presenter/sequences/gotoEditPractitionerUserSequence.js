import { getUserByIdAction } from '../actions/getUserByIdAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFullUserOnFormAction } from '../actions/setFullUserOnFormAction';

export const gotoEditPractitionerUserSequence = [
  getUserByIdAction,
  setFullUserOnFormAction,
  setCurrentPageAction('EditPractitionerUser'),
];
