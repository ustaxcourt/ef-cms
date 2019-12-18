import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeleteCaseNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setDeleteCaseNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteJudgesCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteCaseNoteModalStateAction,
  setShowModalFactoryAction('DeleteJudgesCaseNoteConfirmModal'),
];
