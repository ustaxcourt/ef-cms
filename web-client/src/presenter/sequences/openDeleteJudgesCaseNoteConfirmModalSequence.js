import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeleteJudgesCaseNoteModalStateAction } from '../actions/TrialSessionWorkingCopy/setDeleteJudgesCaseNoteModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeleteJudgesCaseNoteConfirmModalSequence = [
  clearModalStateAction,
  setDeleteJudgesCaseNoteModalStateAction,
  setShowModalFactoryAction('DeleteJudgesCaseNoteConfirmModal'),
];
