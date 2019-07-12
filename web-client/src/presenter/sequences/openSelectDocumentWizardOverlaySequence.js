import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const openSelectDocumentWizardOverlaySequence = [
  clearModalStateAction,
  set(state.modal.forSecondary, props.forSecondary),
  set(state.showModal, 'SelectDocumentWizardOverlay'),
];
