import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeleteCaseNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setDeleteCaseNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteCaseNoteModalStateAction,
  setShowModalFactoryAction('DeleteCaseNoteConfirmModal'),
];
