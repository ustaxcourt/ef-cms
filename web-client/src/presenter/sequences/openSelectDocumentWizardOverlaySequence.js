import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openSelectDocumentWizardOverlaySequence = [
  clearModalStateAction,
  set(state.showModal, 'SelectDocumentWizardOverlay'),
];
