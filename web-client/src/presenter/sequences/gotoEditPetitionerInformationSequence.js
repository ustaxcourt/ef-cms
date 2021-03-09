import { getCaseAction } from '../actions/getCaseAction';
import { getUserPendingEmailAction } from '../actions/getUserPendingEmailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserPendingEmailAction } from '../actions/setUserPendingEmailAction';
import { setupPetitionerInformationFormAction } from '../actions/setupPetitionerInformationFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditPetitionerInformationSequence = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  getCaseAction,
  setCaseAction,
  setupPetitionerInformationFormAction,
  getUserPendingEmailAction,
  setUserPendingEmailAction,
  setCurrentPageAction('EditPetitionerInformation'),
];
