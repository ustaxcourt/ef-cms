import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setupPetitionerInformationFormAction } from '../actions/setupPetitionerInformationFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditPetitionerInformationSequence = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  getCaseAction,
  setCaseAction,
  setupPetitionerInformationFormAction,
  setCurrentPageAction('EditPetitionerInformation'),
];
