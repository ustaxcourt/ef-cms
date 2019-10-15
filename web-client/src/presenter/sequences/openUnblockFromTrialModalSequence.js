import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openUnblockFromTrialModalSequence = [
  set(state.showModal, 'UnblockFromTrialModal'),
];
