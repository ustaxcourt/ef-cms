import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPetitionerCounselFormAction } from '../actions/caseDetailEdit/setPetitionerCounselFormAction';

export const gotoEditPetitionerCounselSequence = [
  getCaseAction,
  setCaseAction,
  setPetitionerCounselFormAction,
  setCurrentPageAction('EditPetitionerCounsel'),
];
