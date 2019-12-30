import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const gotoEditPetitionDetailsSequence = [
  set(state.caseDetailPage.showEditPetition, true),
];
