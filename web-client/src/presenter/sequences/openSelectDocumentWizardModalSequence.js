import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openSelectDocumentWizardModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'SelectDocumentWizardModalDialog'),
];
