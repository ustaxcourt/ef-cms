import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const formCancelToggleCancelSequence = [
  set(state.showModal, 'FormCancelModalDialog'),
];
