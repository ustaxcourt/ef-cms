import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCaseDifferenceModalSequence = [
  set(state.showModal, 'CaseDifferenceModalOverlay'),
];
