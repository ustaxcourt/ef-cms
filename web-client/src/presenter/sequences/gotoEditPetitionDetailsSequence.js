import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { setupEditPetitionDetailFormAction } from '../actions/setupEditPetitionDetailFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditPetitionDetailsSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  getCaseAction,
  setCaseAction,
  getProcedureTypesAction,
  setProcedureTypesAction,
  stopShowValidationAction,
  setupEditPetitionDetailFormAction,
  setCurrentPageAction('EditPetitionDetails'),
];
