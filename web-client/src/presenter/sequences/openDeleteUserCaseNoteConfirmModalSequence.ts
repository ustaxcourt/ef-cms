import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeleteUserCaseNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setDeleteUserCaseNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteUserCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteUserCaseNoteModalStateAction,
  setShowModalFactoryAction('DeleteUserCaseNoteConfirmModal'),
];
