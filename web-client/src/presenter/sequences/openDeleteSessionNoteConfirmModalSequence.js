import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openDeleteSessionNoteConfirmModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'DeleteSessionNoteConfirmModal'),
];
