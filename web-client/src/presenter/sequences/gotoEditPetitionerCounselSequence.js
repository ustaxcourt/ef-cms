import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPetitionerCounselFormAction } from '../actions/CaseAssociation/setPetitionerCounselFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditPetitionerCounselSequence = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  setPetitionerCounselFormAction,
  setCurrentPageAction('EditPetitionerCounsel'),
];
