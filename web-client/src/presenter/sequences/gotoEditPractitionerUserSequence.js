import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailOnFormAction } from '../actions/Practitioners/setPractitionerDetailOnFormAction';

export const gotoEditPractitionerUserSequence = [
  getPractitionerDetailAction,
  setPractitionerDetailOnFormAction,
  setCurrentPageAction('EditPractitionerUser'),
];
