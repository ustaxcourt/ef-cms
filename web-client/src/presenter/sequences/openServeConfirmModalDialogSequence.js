import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openServeConfirmModalDialogSequence = [
  clearModalStateAction,
  set(state.showModal, 'ServeConfirmModalDialog'),
];
