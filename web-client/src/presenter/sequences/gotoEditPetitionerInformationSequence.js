import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setupPetitionerInformationFormAction } from '../actions/setupPetitionerInformationFormAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';

export const gotoEditPetitionerInformationSequence = [
  setCurrentPageAction('Interstitial'),
  startShowValidationAction,
  getCaseAction,
  setCaseAction,
  setupPetitionerInformationFormAction,
  setCurrentPageAction('EditPetitionerInformation'),
];
