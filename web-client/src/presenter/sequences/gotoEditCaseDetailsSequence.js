import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setupEditPetitionDetailFormAction } from '../actions/setupEditPetitionDetailFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditCaseDetailsSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  getCaseAction,
  setCaseAction,
  stopShowValidationAction,
  setupEditPetitionDetailFormAction,
  setCurrentPageAction('EditCaseDetails'),
];
