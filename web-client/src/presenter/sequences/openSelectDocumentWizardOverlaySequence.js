import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openSelectDocumentWizardOverlaySequence = [
  clearModalStateAction,
  set(state.modal.forSecondary, props.forSecondary),
  setShowModalFactoryAction('SelectDocumentWizardOverlay'),
];
