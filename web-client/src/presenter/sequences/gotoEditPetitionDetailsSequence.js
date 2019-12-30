import { clearFormAction } from '../actions/clearFormAction';
import { set } from 'cerebral/factories';
import { setupEditPetitionDetailFormAction } from '../actions/setupEditPetitionDetailFormAction';
import { state } from 'cerebral';

export const gotoEditPetitionDetailsSequence = [
  clearFormAction,
  set(state.caseDetailPage.showEditPetition, true), // TODO: probably put in action
  setupEditPetitionDetailFormAction,
];
