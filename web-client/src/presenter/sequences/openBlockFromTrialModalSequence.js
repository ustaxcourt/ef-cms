import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openBlockFromTrialModalSequence = [
  set(state.showValidation, false),
  set(state.showModal, 'BlockFromTrialModal'),
];
