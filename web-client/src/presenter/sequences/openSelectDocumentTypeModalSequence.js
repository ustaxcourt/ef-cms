import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openSelectDocumentTypeModalSequence = [
  set(state.showModal, 'SelectDocumentTypeModalDialog'),
];
