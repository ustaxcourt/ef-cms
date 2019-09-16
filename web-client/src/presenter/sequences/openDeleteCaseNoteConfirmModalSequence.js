import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setDeleteCaseNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setDeleteCaseNoteModalStateAction';
import { state } from 'cerebral';

export const openDeleteCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteCaseNoteModalStateAction,
  set(state.showModal, 'DeleteCaseNoteConfirmModal'),
];
