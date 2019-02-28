import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const startACaseToggleCancelSequence = [
  set(state.showModal, 'StartCaseCancelModalDialog'),
];
