import { set } from 'cerebral/factories';
import { setupEditPetitionDetailFormAction } from '../actions/setupEditPetitionDetailFormAction';
import { state } from 'cerebral';

export const gotoEditPetitionDetailsSequence = [
  set(state.caseDetailPage.showEditPetition, true), // TODO: probably put in action
  setupEditPetitionDetailFormAction,
];
