import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setDeleteModalStateAction } from '../actions/TrialSessionWorkingCopy/setDeleteModalStateAction';
import { state } from 'cerebral';

export const openDeleteCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteModalStateAction,
  set(state.showModal, 'DeleteCaseNoteConfirmModal'),
];
