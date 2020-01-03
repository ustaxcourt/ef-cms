import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const cancelEditPetitionDetailsSequence = [
  set(state.caseDetailPage.showEditPetition, false),
];
