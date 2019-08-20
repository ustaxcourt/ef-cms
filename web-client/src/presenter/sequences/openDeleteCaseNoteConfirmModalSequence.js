import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openDeleteCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'DeleteCaseNoteConfirmModal'),
];
